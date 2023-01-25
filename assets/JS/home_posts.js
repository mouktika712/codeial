{
    // method to submit the form data for new post using AJAX
    let createPost = function (){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(event) {
            // preventing the default submission of the form
            event.preventDefault();

            // submitting the data for the post manually
            $.ajax({
                type: 'post',       //Specifies the type of request. (GET or POST)
                url: '/posts/create',   //Specifies the URL to send the request to. Default is the current page
                data: newPostForm.serialize(),    //specifies data to be sent to the server (to the mentionaed url)
                success: function(data){            //success(result,status,xhr):	A function to be run when the request succeeds
                    console.log(data);
                    // see the console.log(data) in the browser for understanding data.data.post
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));
                }, error: function(error) {         //error(xhr,status,error):	A function to run if the request fails.
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post in DOM (call this function in success)
    let newPostDom = function(post) {
        return $(`<li id="post-${post._id}">
                    <p>
                        ${ post.content }
                        <br>
                        <small>
                            ${ post.user.name }
                        </small>
                        <br>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">Delete Post</a>
                        </small> 
                    </p>

                    <div class="post-comments">
                        <form action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type Here to add comment..." required>
                            <input type="hidden" name="post" value="${post._id}" >
                            <input type="submit" value="Add Comment">
                        </form>
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                        
                            </ul>
                        </div>
                    </div>
        
                </li>`);
    }





    // method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $('deleteLink').click(function(event){
            event.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    $(`#post-${data.data.post_id}`).remove();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }
    
    createPost();
}