/*======================================================================*\
|| #################################################################### ||
|| # vBulletin 4.2.0 Patch Level 4
|| # ---------------------------------------------------------------- # ||
|| # Copyright �2000-2019 vBulletin Solutions Inc. All Rights Reserved. ||
|| # This file may not be redistributed in whole or significant part. # ||
|| # ---------------- VBULLETIN IS NOT FREE SOFTWARE ---------------- # ||
|| # http://www.vbulletin.com | http://www.vbulletin.com/license.html # ||
|| #################################################################### ||
\*======================================================================*/
vBulletin.widget=new Object();vBulletin.widget.TreeView=function(B,A){vBulletin.widget.TreeView.superclass.constructor.apply(this,arguments);this.createEvent("nodeMove");this.subscribe("expandComplete",function(C){this.walkNode(C,this.attachDragDrop)})};YAHOO.extend(vBulletin.widget.TreeView,YAHOO.widget.TreeView,{render_lock:false,render:function(){vBulletin.widget.TreeView.superclass.render.apply(this,arguments);this.walkTree(this.attachDragDrop)},walkTree:function(A){return this.walkNode(this.getRoot(),A)},walkNode:function(C,B){for(var A=0;A<C.children.length;A++){B(C.children[A]);this.walkNode(C.children[A],B)}},get_expanded:function(){var A=[];this.walkTree(function(B){if(B.expanded&&B.children.length>0){A.push(B)}});return A},attachDragDrop:function(C){var B=C.getContentEl();if(B){var A=new vBulletin.widget.DDTreeNode(C,B.id,null,{centerFrame:true,resizeFrame:false});A.addInvalidHandleType("a")}},is_ancestor:function(B,A){current=B;while(current){if(current.getEl().id==A.getEl().id){return true}current=current.parent}return false}});vBulletin.widget.DDTreeNode=function(C,D,A,B){vBulletin.widget.DDTreeNode.superclass.constructor.apply(this,new Array(D,A,B));this.tree_node=C;this.getDragEl().style.border="none";this.getDragEl().style.cursor="pointer"};YAHOO.extend(vBulletin.widget.DDTreeNode,YAHOO.util.DDProxy,{tree_node:null,current_target:null,startDrag:function(A,B){},endDrag:function(A){},onDragOver:function(A,B){this.remove_drag_classes(this.current_target);this.current_target=B;YAHOO.util.Dom.addClass(B,"drag"+this.get_drop_location(B))},onDragOut:function(A,B){var B=this.current_target;this.remove_drag_classes(this.current_target);this.current_target=null},onDrag:function(A){this.remove_drag_classes(this.current_traget);if(this.current_target){YAHOO.util.Dom.addClass(this.current_target,"drag"+this.get_drop_location(this.current_target))}},remove_drag_classes:function(A){if(A){YAHOO.util.Dom.removeClass(A,"dragbefore");YAHOO.util.Dom.removeClass(A,"dragafter");YAHOO.util.Dom.removeClass(A,"dragon")}},onDragDrop:function(F,G){var C=YAHOO.util.Dom;var D=YAHOO.util.DragDropMgr;var A=this.tree_node.tree;var E=D.getDDById(G);var B=this.get_drop_location(G);if(A.is_ancestor(E.tree_node,this.tree_node)){return false}A.popNode(this.tree_node);if(B=="on"){this.tree_node.appendTo(E.tree_node);E.tree_node.expand()}else{if(B=="before"){this.tree_node.insertBefore(E.tree_node)}else{if(B=="after"){this.tree_node.insertAfter(E.tree_node)}}}A.render();A.fireEvent("nodeMove",this.tree_node)},get_drop_location:function(D){var C=YAHOO.util.DragDropMgr.interactionInfo.point;var A=YAHOO.util.Dom.getRegion(D);var B=(A.bottom-A.top)/3;if(C.top<A.top+B){return"before"}else{if(C.top>A.bottom-B){return"after"}else{return"on"}}}});