/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.0 Patch Level 4
|| # ---------------------------------------------------------------- # ||
|| # Copyright ©2000-2019 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
vBulletin.events.systemInit.subscribe(function(){if(AJAX_Compatible){vB_QuickEditor_Watcher=new vB_QuickEditor_Watcher()}});function vB_QuickEditor_Watcher(){this.editorcounter=0;this.controls=new Object();this.open_objectid=null;this.vars=new Object();this.init()}vB_QuickEditor_Watcher.prototype.init=function(){if(vBulletin.elements.vB_QuickEdit){for(var C=0;C<vBulletin.elements.vB_QuickEdit.length;C++){var G=vBulletin.elements.vB_QuickEdit[C].splice(0,1)[0];var B=vBulletin.elements.vB_QuickEdit[C].splice(0,1)[0];var A=vBulletin.elements.vB_QuickEdit[C];var D=window["vB_QuickEditor_"+B+"_Vars"];if(typeof (D)=="undefined"){console.log("Function Not Found: vB_QuickEditor_"+B+"_Vars");continue}var F=null;if(typeof (this.vars[B])=="undefined"){var E=new D(A);this.vars[B]=E;F=this.vars[B]}else{if(this.vars[B].peritemsettings==true){F=new D(A)}else{F=this.vars[B]}}var H=YAHOO.util.Dom.get(this.vars[B].containertype+"edit_"+G);if(H){this.controls[B+"_"+G]=this.fetch_editor_class(G,B,F,B+"_"+G);this.controls[B+"_"+G].init()}else{console.log(F.containertype+"_edit_"+G+" not found")}}vBulletin.elements.vB_QuickEdit=null}};vB_QuickEditor_Watcher.prototype.fetch_editor_class=function(F,A,E,C){var B=window["vB_QuickEditor_"+A];if(typeof (B)=="undefined"){var D=new vB_QuickEditor_Generic(F,this,E,C)}else{var D=new B(F,this,E,C)}return D};vB_QuickEditor_Watcher.prototype.close_all=function(){if(this.open_objectid){this.controls[this.open_objectid].abort()}};vB_QuickEditor_Watcher.prototype.hide_errors=function(){if(this.open_objectid){this.controls[this.open_objectid].hide_errors()}};function vB_QuickEditor_Generic(D,A,C,B){this.objectid=D;this.watcher=A;this.vars=C;this.controlid=B;this.originalhtml=null;this.ajax_req=null;this.show_advanced=true;this.messageobj=null;this.node=null;this.progress_indicator=null;this.editbutton=null}vB_QuickEditor_Generic.prototype.init=function(){this.originalhtml=null;this.ajax_req=null;this.show_advanced=true;this.messageobj=YAHOO.util.Dom.get(this.vars.messagetype+this.objectid);this.node=YAHOO.util.Dom.get(this.vars.containertype+this.objectid);this.progress_indicator=YAHOO.util.Dom.get(this.vars.containertype+"progress_"+this.objectid);var A=YAHOO.util.Dom.get(this.vars.containertype+"edit_"+this.objectid);this.editbutton=A;YAHOO.util.Event.on(this.editbutton,"click",this.edit,this,true)};vB_QuickEditor_Generic.prototype.remove_clickhandler=function(){YAHOO.util.Event.purgeElement(this.editbutton)};vB_QuickEditor_Generic.prototype.ready=function(){if(this.watcher.open_objectid!=null||YAHOO.util.Connect.isCallInProgress(this.ajax_req)){return false}else{return true}};vB_QuickEditor_Generic.prototype.edit=function(B){if(this.watcher.open_objectid!=null){var A=this.watcher.open_objectid.toString();var C=A.indexOf("_")}else{var A="";var C=0}if(typeof (vb_disable_ajax)!="undefined"&&vb_disable_ajax>0){return true}if(B){YAHOO.util.Event.stopEvent(B)}if(YAHOO.util.Connect.isCallInProgress(this.ajax_req)){return false}else{if(!this.ready()){if(this.objectid==A.substr(C+1,A.length)){this.full_edit();return false}this.watcher.close_all()}}this.watcher.open_objectid=this.controlid;this.watcher.editorcounter++;this.editorid="vB_Editor_QE_"+this.vars.containertype+this.watcher.editorcounter;this.originalhtml=this.messageobj.innerHTML;this.unchanged=null;this.unchanged_reason=null;this.fetch_editor();return false};vB_QuickEditor_Generic.prototype.fetch_editor=function(){if(this.progress_indicator){YAHOO.util.Dom.removeClass(this.progress_indicator,"hidden")}document.body.style.cursor="wait";YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url(this.vars.ajaxtarget+"?do="+this.vars.ajaxaction+"&"+this.vars.objecttype+"="+this.objectid),{success:this.display_editor,failure:this.error_opening_editor,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do="+this.vars.ajaxaction+"&"+this.vars.objecttype+"="+this.objectid+"&editorid="+PHP.urlencode(this.editorid))};vB_QuickEditor_Generic.prototype.handle_save_error=function(A){vBulletin_AJAX_Error_Handler(A);window.location=this.fail_url()};vB_QuickEditor_Generic.prototype.fail_url=function(){return this.vars.target+"?"+SESSIONURL+"do="+this.getaction+"&"+this.vars.objecttype+"="+this.objectid};vB_QuickEditor_Generic.prototype.handle_save_error=function(A){vBulletin_AJAX_Error_Handler(A);this.show_advanced=false;this.full_edit()};vB_QuickEditor_Generic.prototype.display_editor=function(ajax){if(ajax.responseXML){if(this.progress_indicator){YAHOO.util.Dom.addClass(this.progress_indicator,"hidden")}document.body.style.cursor="auto";if(fetch_tag_count(ajax.responseXML,"disabled")){window.location=this.fail_url()}else{if(fetch_tag_count(ajax.responseXML,"error")){}else{var editor=fetch_tags(ajax.responseXML,"editor")[0];var reason=editor.getAttribute("reason");this.messageobj.innerHTML=editor.firstChild.nodeValue;var editreason=YAHOO.util.Dom.get(this.editorid+"_edit_reason");if(editreason){this.unchanged_reason=PHP.unhtmlspecialchars(reason);editreason.value=this.unchanged_reason;editreason.onkeypress=vB_QuickEditor_Delete_Events.prototype.reason_key_trap}if(typeof JSON=="object"&&typeof JSON.parse=="function"){var ckeconfig=JSON.parse(fetch_tags(ajax.responseXML,"ckeconfig")[0].firstChild.nodeValue)}else{var ckeconfig=eval("("+fetch_tags(ajax.responseXML,"ckeconfig")[0].firstChild.nodeValue+")")}vB_Editor[this.editorid]=new vB_Text_Editor(this.editorid,ckeconfig);if(vB_Editor[this.editorid].editorready){this.display_editor_final("editorready",null,this)}else{vB_Editor[this.editorid].vBevents.editorready.subscribe(this.display_editor_final,this)}}}}};vB_QuickEditor_Generic.prototype.display_editor_final=function(C,A,D){vB_Editor[this.editorid].check_focus();D.unchanged=vB_Editor[D.editorid].get_editor_contents();YAHOO.util.Event.on(D.editorid+"_save","click",D.save,D,true);YAHOO.util.Event.on(D.editorid+"_abort","click",D.abort,D,true);YAHOO.util.Event.on(D.editorid+"_adv","click",D.full_edit,D,true);YAHOO.util.Event.on("quick_edit_errors_hide","click",D.hide_errors,D,true);YAHOO.util.Event.on("quick_edit_errors_cancel","click",D.abort,D,true);var B=YAHOO.util.Dom.get(D.editorid+"_delete");if(B){YAHOO.util.Event.on(D.editorid+"_delete","click",D.show_delete,D,true)}init_popupmenus(YAHOO.util.Dom.get(D.editorid))};vB_QuickEditor_Generic.prototype.restore=function(B,A){this.hide_errors(true);if(this.editorid&&vB_Editor[this.editorid]){vB_Editor[this.editorid].destroy()}if(A=="node"){var C=string_to_node(B);this.node.parentNode.replaceChild(C,this.node)}else{this.messageobj.innerHTML=B}this.watcher.open_objectid=null};vB_QuickEditor_Generic.prototype.abort=function(A){if(A){YAHOO.util.Event.stopEvent(A)}if(this.progress_indicator){YAHOO.util.Dom.addClass(this.progress_indicator,"hidden")}document.body.style.cursor="auto";this.restore(this.originalhtml,"messageobj")};vB_QuickEditor_Generic.prototype.full_edit=function(B){if(vB_Editor[this.editorid]){if(B){YAHOO.util.Event.stopEvent(B)}vB_Editor[this.editorid].uninitialize();var A=new vB_Hidden_Form(this.vars.target+"?do="+this.vars.postaction+"&"+this.vars.objecttype+"="+this.objectid);A.add_variable("do",this.vars.postaction);A.add_variable("s",fetch_sessionhash());A.add_variable("securitytoken",SECURITYTOKEN);if(this.show_advanced){A.add_variable("advanced",1)}A.add_variable(this.vars.objecttype,this.objectid);A.add_variable("message",vB_Editor[this.editorid].getRawData());A.add_variable("reason",YAHOO.util.Dom.get(this.editorid+"_edit_reason").value);A.add_variable("wysiwyg",vB_Editor[this.editorid].is_wysiwyg_mode());A.submit_form()}};vB_QuickEditor_Generic.prototype.save=function(B){YAHOO.util.Event.stopEvent(B);vB_Editor[this.editorid].uninitialize();var C=vB_Editor[this.editorid].get_editor_contents();var A=YAHOO.util.Dom.get(this.editorid+"_edit_reason");if(C==this.unchanged&&A&&A.value==this.unchanged_reason){this.abort(B)}else{YAHOO.util.Dom.get(this.editorid+"_posting_msg").style.display="";document.body.style.cursor="wait";this.ajax_req=YAHOO.util.Connect.asyncRequest("POST",fetch_ajax_url(this.vars.target+"?do="+this.vars.postaction+"&"+this.vars.objecttype+"="+this.objectid),{success:this.update,faulure:this.handle_save_error,timeout:vB_Default_Timeout,scope:this},SESSIONURL+"securitytoken="+SECURITYTOKEN+"&do="+this.vars.postaction+"&ajax=1&"+this.vars.objecttype+"="+this.objectid+"&message="+PHP.urlencode(C)+"&reason="+PHP.urlencode(YAHOO.util.Dom.get(this.editorid+"_edit_reason").value)+"&relpath="+PHP.urlencode(RELPATH)+"&parseurl=1");this.pending=true}};vB_QuickEditor_Generic.prototype.show_delete=function(){this.deletedialog=YAHOO.util.Dom.get("quickedit_delete");if(this.deleteddialog&&this.deleteddialog.style.display!=""){this.deletedialog.style.display="";this.deletebutton=YAHOO.util.Dom.get("quickedit_dodelete");YAHOO.util.Event.on(this.deletebutton,"click",this.delete_post,this,true);var B=YAHOO.util.Dom.get("del_reason");if(B){B.onkeypress=vB_QuickEditor_Delete_Events.prototype.delete_items_key_trap}if(!is_opera&&!is_saf){this.deletebutton.disabled=true;this.deleteoptions=new Array();this.deleteoptions.leave=YAHOO.util.Dom.get("rb_del_leave");this.deleteoptions.soft=YAHOO.util.Dom.get("rb_del_soft");this.deleteoptions.hard=YAHOO.util.Dom.get("rb_del_hard");for(var A in this.deleteoptions){if(YAHOO.lang.hasOwnProperty(this.deleteoptions,A)&&this.deleteoptions[A]){this.deleteoptions[A].onclick=this.deleteoptions[A].onchange=vB_QuickEditor_Delete_Events.prototype.delete_button_handler;this.deleteoptions[A].onkeypress=vB_QuickEditor_Delete_Events.prototype.delete_items_key_trap}}}}};vB_QuickEditor_Generic.prototype.delete_post=function(){var A=YAHOO.util.Dom.get("rb_del_leave");if(A&&A.checked){this.abort();return }var B=new vB_Hidden_Forum(this.vars.target);B.add_variable("do",this.vars.deleteaction);B.add_variable("s",fetch_sessionhash());B.add_variable("securitytoken",SECURITYTOKEN);B.add_variabl(this.vars.objecttype,this.objectid);B.add_variables_from_object(this.deletedialog);vB_Editor[this.editorid].uninitialize();B.submit_form()};vB_QuickEditor_Generic.prototype.update=function(D){if(D.responseXML){this.pending=false;document.body.style.cursor="auto";YAHOO.util.Dom.get(this.editorid+"_posting_msg").style.display="none";if(fetch_tag_count(D.responseXML,"error")){var E=fetch_tags(D.responseXML,"error");var A="<ol>";for(var B=0;B<E.length;B++){A+="<li>"+E[B].firstChild.nodeValue+"</li>"}A+="</ol>";this.show_errors(A)}else{var C=D.responseXML.getElementsByTagName("message");this.restore(C[0].firstChild.nodeValue,"node");this.remove_clickhandler();this.init()}}return false};vB_QuickEditor_Generic.prototype.show_errors=function(A){YAHOO.util.Dom.get("ajax_post_errors_message").innerHTML=A;var B=YAHOO.util.Dom.get("ajax_post_errors");B.style.width="400px";B.style.zIndex=500;var C=(is_saf?"body":"documentElement");B.style.left=(is_ie?document.documentElement.clientWidth:self.innerWidth)/2-200+document[C].scrollLeft+"px";B.style.top=(is_ie?document.documentElement.clientHeight:self.innerHeight)/2-150+document[C].scrollTop+"px";YAHOO.util.Dom.removeClass(B,"hidden")};vB_QuickEditor_Generic.prototype.hide_errors=function(A){this.errors=false;var B=YAHOO.util.Dom.get("ajax_post_errors");if(B){YAHOO.util.Dom.addClass(B,"hidden")}if(A!=true){vB_Editor[this.editorid].check_focus()}};function vB_QuickEditor_Delete_Events(){}vB_QuickEditor_Delete_Events.prototype.delete_button_handler=function(C){var B=vB_QuickEditor_Watcher.open_objectid;var A=vB_QuickEditor_Watcher.controls[B];if(this.id=="rb_del_leave"&&this.checked){A.deletebutton.disabled=true}else{A.deletebutton.disabled=false}};vB_QuickEditor_Delete_Events.prototype.reason_key_trap=function(C){var B=vB_QuickEditor_Watcher.open_objectid;var A=vB_QuickEditor_Watcher.controls[B];C=C?C:window.event;switch(C.keyCode){case 9:YAHOO.util.Dom.get(A.editorid+"_save").focus();return false;break;case 13:A.save();return false;break;default:return true}};vB_QuickEditor_Delete_Events.prototype.delete_items_key_trap=function(C){var B=vB_QuickEditor_Watcher.open_objectid;var A=vB_QuickEditor_Watcher.controls[B];C=C?C:window.event;if(C.keyCode==13){if(open_obj.deletebutton.disabled==false){open_obj.delete_post()}return false}return true};