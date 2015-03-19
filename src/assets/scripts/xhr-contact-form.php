<?php
/**
 * Script to submit the contents of the contact form via an XHR. Contents of the form are sent to this script by the
 * site javascript. This just processes the data and sends it to the specified email address.
 *
 * Created by PhpStorm.
 * User: Michael
 * Date: 17/11/13
 * Time: 11:49
 */

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$fromEmail = $request->email;
$message = $request->message;

$subject = "An email from my personal website";
$headers = "From: $fromEmail\r\n";

if(mail("%%EMAIL_ADDRESS%%", $subject, $message, $headers)) {
	echo 1;
}
else {
	echo 0;
}
