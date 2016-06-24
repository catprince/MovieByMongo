$(function(){
    $('.comment').click(function(e){
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
       $('<input>').attr({
           type: 'hidden',
           id: 'toId',
           name: 'comment[tid]',
           value: toId
       }).appendTo('#commentForm');

        $('<input>').attr({
            type: 'hidden',
            id: 'commentId',
            name: 'comment[cid]',
            value: commentId
        }).appendTo('#commentForm')
    });
});