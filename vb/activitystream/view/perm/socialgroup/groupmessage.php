<?php

/* ======================================================================*\
  || #################################################################### ||
  || # vBulletin 4.2.0 Patch Level 4 - Licence Number VBF83FEF44
  || # ---------------------------------------------------------------- # ||
  || # Copyright �2000-2019 vBulletin Solutions Inc. All Rights Reserved. ||
  || # This file may not be redistributed in whole or significant part. # ||
  || # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
  || # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
  || #################################################################### ||
  \*====================================================================== */

class vB_ActivityStream_View_Perm_Socialgroup_Groupmessage extends vB_ActivityStream_View_Perm_Socialgroup_Base
{
	public function __construct(&$content)
	{
		$this->requireExist['vB_ActivityStream_View_Perm_Socialgroup_Discussion'] = 1;
		return parent::__construct($content);
	}

	public function group($activity)
	{
		if (!$this->fetchCanUseGroups())
		{
			return;
		}

		if (!$this->content['socialgroup_message'][$activity['contentid']])
		{
			$this->content['gmid'][$activity['contentid']] = 1;
		}
	}

	public function process()
	{
		if (!$this->content['gmid'])
		{
			return true;
		}

		$messages = vB::$db->query_read_slave("
			SELECT
				gm.gmid AS m_gmid, gm.discussionid AS m_discussionid, gm.dateline AS m_dateline, gm.postuserid AS m_postuserid, gm.postuserid AS m_userid,
				gm.pagetext AS m_pagetext, gm.postusername AS m_postusername, gm.state AS m_state, d.visible AS d_visible,
				d.groupid AS d_groupid, d.firstpostid AS d_firstpostid, d.discussionid AS d_discussionid, firstpost.postuserid AS d_userid, firstpost.pagetext AS d_pagetext,
				firstpost.state AS d_state, firstpost.postuserid AS d_postuserid, firstpost.title AS d_title, firstpost.postusername AS d_postusername,
				sg.options AS g_options, sg.groupid AS g_groupid, sg.name AS g_name, sg.creatoruserid AS g_creatoruserid, sg.creatoruserid AS g_userid,
				sg.dateline AS g_dateline, sg.type AS g_type
				" . (vB::$vbulletin->userinfo['userid'] ? ", sgm.type AS g_membertype" : "") . "
			FROM " . TABLE_PREFIX . "groupmessage AS gm
			INNER JOIN " . TABLE_PREFIX . "discussion AS d ON (gm.discussionid = d.discussionid)
			INNER JOIN " . TABLE_PREFIX . "groupmessage AS firstpost ON (firstpost.gmid = d.firstpostid)
			INNER JOIN " . TABLE_PREFIX . "socialgroup AS sg ON (d.groupid = sg.groupid)
			" . (vB::$vbulletin->userinfo['userid'] ? "LEFT JOIN " . TABLE_PREFIX . "socialgroupmember AS sgm ON (sgm.userid = " . vB::$vbulletin->userinfo['userid'] . " AND sgm.groupid = sg.groupid)" : "") . "
			WHERE
				gm.gmid IN (" . implode(",", array_keys($this->content['gmid'])) . ")
					AND
				gm.state <> 'deleted'
					AND
				firstpost.state <> 'deleted'
		");
		while ($message = vB::$db->fetch_array($messages))
		{
			// Unset these values so we don't query for the discussions and groups when the process() functions for those get called .. we already have them
			unset($this->content['discussionid'][$message['m_discussionid']], $this->content['groupid'][$message['d_groupid']]);
			$this->content['socialgroup_message'][$message['m_gmid']] = $this->parse_array($message, 'm_');
			$this->content['userid'][$message['m_postuserid']] = 1;
			if (!$this->content['socialgroup_discussion'][$message['m_discussionid']])
			{
				$this->content['socialgroup_discussion'][$message['m_discussionid']] = $this->parse_array($message, 'd_');
				$this->content['userid'][$message['d_postuserid']] = 1;
			}
			if (!$this->content['socialgroup'][$message['d_groupid']])
			{
				$this->content['socialgroup'][$message['d_groupid']] = $this->parse_array($message, 'g_');
				$this->content['socialgroup'][$message['d_groupid']]['is_owner'] = ($this->content['socialgroup'][$message['d_groupid']]['creatoruserid'] == vB::$vbulletin->userinfo['userid']);
				$this->content['userid'][$message['g_creatoruserid']] = 1;
			}
		}

		$this->content['gmid'] = array();
	}

	public function fetchCanView($record)
	{
		$this->processUsers();
		return $this->fetchCanViewSocialgroupGroupMessage($record['contentid']);
	}

	/*
	 * Register Template
	 *
	 * @param	string	Template Name
	 * @param	array	Activity Record
	 *
	 * @return	string	Template
	 */
	public function fetchTemplate($templatename, $activity)
	{
		$messageinfo =& $this->content['socialgroup_message'][$activity['contentid']];
		$discussioninfo =& $this->content['socialgroup_discussion'][$messageinfo['discussionid']];
		$groupinfo =& $this->content['socialgroup'][$discussioninfo['groupid']];

		$activity['postdate'] = vbdate(vB::$vbulletin->options['dateformat'], $activity['dateline'], true);
		$activity['posttime'] = vbdate(vB::$vbulletin->options['timeformat'], $activity['dateline']);

		$preview = strip_quotes($messageinfo['pagetext']);
		$messageinfo['preview'] = htmlspecialchars_uni(fetch_censored_text(
			fetch_trimmed_title(strip_bbcode($preview, false, true, true, true),
				vb::$vbulletin->options['as_snippet'])
		));
		$userinfo = $this->fetchUser($activity['userid'], $messageinfo['postusername']);

		$templater = vB_Template::create($templatename);
			$templater->register('userinfo', $userinfo);
			$templater->register('activity', $activity);
			$templater->register('messageinfo', $messageinfo);
			$templater->register('discussioninfo', $discussioninfo);
			$templater->register('groupinfo', $groupinfo);
		return $templater->render();
	}
}

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 05:05, Mon May 6th 2019
|| # CVS: $RCSfile$ - $Revision: 57655 $
|| ####################################################################
\*======================================================================*/