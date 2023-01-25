{
    let createComment = function() {
        let newCommentForm = $('#new-comment-form');
        // console.log(newCommentForm);

        newCommentForm.submit(function(event) {
            event.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                // here data is the json object we received from server as a response
                success: function(data) {

                    console.log(data);

                    let comment = data.data.comment;
                    let newComment = newCommentDom(comment);
        
                    $(`#post-comments-${ comment.post }`).append(newComment);

                    deleteComment($('.delete-comment-button', newComment));
                
                }, error(error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    // call this function in success and pass on the comment object
    let newCommentDom = function(comment) {
        return $(`<li id="comment-${comment.id}">
            <p>
                ${ comment.content }
                <br>
                <small>
                    ${ comment.user.name }
                </small>
                <br>
                <a class="delete-comment-button" href="/comments/destroy/${ comment.id }">delete Comment</a>
            </p> 
        </li>`);
    }

    // method to delete a comment from DOM

    let deleteComment = function(deleteLink) {
        console.log(deleteLink);
        $('deleteLink').click(function(event) {
            event.preventDefault();
            console.log('working')
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    console.log(comment);
                    $(`#comment-${data.data.comment.id}`).remove();
                }, error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    createComment();
}

