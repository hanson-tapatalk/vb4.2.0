<?php
/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.0 Patch Level 4 - Licence Number VBF83FEF44
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2019 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
if (!VB_API) die;

$VB_API_WHITELIST = array(
	'response' => array(
		'content' => array(
			'blogheader',
			'blog' => $VB_API_WHITELIST_COMMON['blog'],
			'bloginfo' => $VB_API_WHITELIST_COMMON['bloginfo'],
			'blogtextinfo',
			'bookmarksites' => $VB_API_WHITELIST_COMMON['bookmarksites'],
			'effective_lastcomment', 'next', 'pagenav', 'prev',
			'responsebits' => $VB_API_WHITELIST_COMMON['responsebits'],
			'status',
			'trackbackbits' => array(
				'*' => array(
					'response' => array(
						'blogtrackbackid', 'checkbox_value', 'url', 'title',
						'time', 'snippet'
					)
				)
			)
		)
	),
	'show' => array(
		'moderatecomments', 'pingback', 'trackback', 'notify', 'blognav',
		'postcomment', 'rating', 'pingbacklink', 'trackbackrdf', 'blogsubscribed',
		'entrysubscribed', 'trackback_moderation', 'comment_moderation',
		'edit', 'delete', 'remove', 'undelete', 'approve', 'inlinemod', 'status',
		'private', 'entryedited', 'tags', 'tag_edit', 'notags', 'attachments',
		'reportlink', 'readmore', 'ignoreduser', 'blograting', 'rateblog',
		'trackbacks', 'entryonly', 'privateentry'
	)
);

function api_result_prerender_2($t, &$r)
{
	switch ($t)
	{
		case 'blog_trackback':
			$r['response']['time'] = $r['response']['dateline'];
			break;
	}
}

vB_APICallback::instance()->add('result_prerender', 'api_result_prerender_2', 2);

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 05:05, Mon May 6th 2019
|| # CVS: $RCSfile$ - $Revision: 35584 $
|| ####################################################################
\*======================================================================*/