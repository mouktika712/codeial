/* if we do not use this middleware...we will need to set the msg separately(to locals) in 
each request's controller while resdin the response.
But by using this...the value for key "success" is found snd set it like below */

module.exports.setFlash = function (req, res, next) {
  // we are setting the flash object in the locals as we need to access the message in views

  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
};

/* We still need to use the flash library:
The user should only see the notification for the first time he makes any reqests.
if he just refresh the page....the req will be made again...so the notification should not be shown everytime.
We just need to show it for the 1st time the req is made.
The flash message is stored in the session cookie at the server side...and once the page is refreshed or any other request is
made the flash msg is removed from the session cookie...so it is displayed only once.
This is done with the help of library
*/
