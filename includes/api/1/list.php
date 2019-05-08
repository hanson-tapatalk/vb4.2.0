<?php
/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.0 Patch Level 4 - Licence Number VBF83FEF44
|| # ---------------------------------------------------------------- # ||
|| # Copyright ©2000-2019 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
if (!VB_API) die;

$VB_API_ROUTE_SEGMENT_WHITELIST = array(
	'action' => array (
		'list'
	)
);

loadCommonWhiteList();

global $methodsegments;

// $methodsegments[0] 'type'
if ($methodsegments[0] == 'category')
{
	$VB_API_WHITELIST = array(
		'response' => array(
			'layout' => array(
				'content' => array(
					'rawtitle',
					'contents' => array(
						'*' => array(
							'id', 'node', 'title', 'authorid', 'authorname', 'page_url', 'showtitle', 'can_edit',
							'showuser', 'showpublishdate', 'viewcount', 'showviewcount',
							'showrating', 'publishdate', 'setpublish', 'publishdatelocal',
							'publishtimelocal', 'showupdated', 'lastupdated', 'dateformat',
							'rating', 'category', 'section_url', 'previewvideo', 'showpreviewonly',
							'previewimage', 'previewtext', 'preview_chopped', 'newcomment_url',
							'comment_count', 'ratingnum', 'ratingavg', 'avatar'
						)
					),
					'pagenav'
				),
			)
		)
	);

	function api_result_prewhitelist_1(&$value)
	{
		if ($value['response'])
		{
			$value['response']['layout']['content']['contents'] = $value['response']['layout']['content']['content_rendered']['contents'];
		}
	}

	vB_APICallback::instance()->add('result_prewhitelist', 'api_result_prewhitelist_1', 1);
}

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 05:05, Mon May 6th 2019
|| # CVS: $RCSfile$ - $Revision: 35584 $
|| ####################################################################
\*======================================================================*/