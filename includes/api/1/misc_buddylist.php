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
		'buddies',
		'offlineusers' => array(
			'*' => array(
				'buddy',
				'show' => array('highlightuser')
			)
		),
		'onlineusers' => array(
			'*' => array(
				'buddy',
				'show' => array('highlightuser')
			)
		)
	),
	'show' => array(
		'playsound'
	)
);

/*======================================================================*\
|| ####################################################################
|| # Downloaded: 05:05, Mon May 6th 2019
|| # CVS: $RCSfile$ - $Revision: 35584 $
|| ####################################################################
\*======================================================================*/