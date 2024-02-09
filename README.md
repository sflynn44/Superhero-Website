# Superhero website

# Authentication method:
    Local authentication which uses email and password as credentials. 
      Login page/area shows text entry fields for  email and password.	[X]
			Entering an existing email and correct password shows successful login. 	[X]
			Entering an email that is not known shows login was unsuccessful .	[X]
			Entering an incorrect password shows login was unsuccessful.	[X]
			A mechanism is provided to update the password for an authenticated user.	[X]
			Login page/area shows a UI control for new account creation (NAC).	[X]
			Selecting NAC shows text entry fields for user name, email and password.	[X]
			During NAC, entering an email that associated with existing account gives an error	[X]
		Input validation for email (proper format).
			Leaving the email field empty prompts the user to enter an email.	[X]
			Leaving password field empty prompts user to enter a password	[X]
			Invalid email address prompts user to enter a valid email	[X]
		Verification of email for a new account.
			The user is instructed to click on the link to verify email	[X]
			User is either shown text or receives the email containing the link	[X]
			Clicking on the link shows a page that says email is validated	[X]
			If a user tries to log in without validating email, user is informed that the email has not been verified and given the chance to resend validation email [X]
		Deactivated accounts. 
			Logging in is disabled for accounts marked as “deactivated”.	[X]
			A message is shown to contact the administrator when attempting to log in.	[X]
# Limited functionality for unauthenticated users: 
		Start page showing application name, a short “about” blurb that says what the site offers, and login button. 
			Start page shows application name	[X]
			Start page shows a description of what the application does	[X]
			Start page shows a login button or a link	[X]
		Interface for searching heroes. 
			One or more mechanisms to enter all search terms and trigger the search.	[X]
			All entries that begin with each search term are shown.	[X]
			Each search result matches all the search terms.	[X]
			Empty search term matches all possible values for that field.	[X]
			Name and publisher of each matching hero are shown, one per line.	[X]
		Expand each search result to view the remaining information. 
			Mechanism to view all available information of a search result.	[X]
			Name and publisher of other results remains visible.	[X]
		Button for search on DDG
			A “Search” button is shown along each displayed track.	[X]
			Clicking on this button opens a new tab showing the DDG search page.	[X]
			Search page shows results of a search using the hero name and publisher.	[X]
		Keywords are soft-matched
			Keywords are matched regardless of capitalization.	[X]
			Keywords are matched regardless of white-space. [X]
			Keywords are matched even when up to two characters are missing or different [X]
		List of public lists (up to 10)
			Start page shows up to 10 public lists created by other users.	[X]
			Any list that is marked as “private” is not shown.	[X]
			Each list shows the name of the list, creator’s nickname, number of heroes in each list  and the average rating.	[X]
			Creator’s email is not shown anywhere on the application. [X]
			list is ordered by the last-modified date.	[X]
			No aspect of a list is modifiable. 	[X]
		Ability to expand each list. 
			Mechanism to expand information shown for each displayed list.	[X]
			When expanded, description and list of heroes  are shown.	[X]
			Mechanism to reset the display back to what is shown in 3.f.ii.	[X]
			Race conditions such as modification, deletion and visibility changes by another user after the list is displayed, but before the list is expanded are handled gracefully.	[X]
		Ability to display additional information for each hero on a public list.
			Mechanism to show additional data as in 3.c for each hero in the list.	[X]
			Mechanism to reset the display back to what is shown in 3.f.ii.	[X]
			Race conditions indicated in 3.g.iv are handled gracefully.	[X]
# Additional functionality for authenticated users:
		Create up to 20 named lists of heroes.
			A mechanism to view all the lists created by the user.	[X]
			Users are prevented from creating a list with the same name in their lists.	[X]
			Mechanism to add an optional description.	[X]
			Mechanism to set the visibility to “public”.	[X]
			Visibility indicator is not set to public when creating a new list.	[X]
			Mechanism to save the newly created list.	[X]
			Users are not allowed to save a list if a required attribute is missing.	[X]
			Upon saving, the new list appears on the lists created by the user.	[X]
		Show full information about a list. 
			Clicking on a list created by the user shows all the information about it. [X]
		Edit all aspects of an existing list. 
			Mechanism to show names of lists created by the user. 	[X]
			Mechanism to select a list for editing.	[X]
			Ability to edit all aspects of a list and save the changes.	[X]
			Ability to add or remove entries from the list.	[X]
			Not able to add an entry that doesn’t exist.	[X]
			Saved changes appear on all applicable views (summary vs detailed) of the list.	[X]
			Updated date is changed to the time of saving the modified information.	[X]
			If the list is public, then sort order in 3.f.v reflects the new modification time.	[X]
			A user is not able to view or edit any aspect of a list that the user does not own even by crafting a request to the back-end.	[X]
		Delete a list.
			A mechanism to select a list for deletion.	[X]
			A mechanism to ask for confirmation before deleting a list. [X]
			Upon confirmation, the list is deleted and the change is immediately reflected.	[X]
			If the confirmation is declined, the list is not deleted.	[X]
			A user is not able to delete a list in a way similar to 4.c.ix.	[X]
		Add a review to a list. 
			Mechanism to select a list for adding a review.	[X]
			Mechanism to enter a rating for the selected list.	[X]
			Mechanism to enter a comment for the selected list.	[X]
			Mechanism to save the review upon confirmation.	[X]
			User name and the creation date of the review are saved along with the review.	[X]
# Administrator functionality related to site maintenance: 
		Special user with administrator access: 
			One specific username is designated as “administrator” (admin).	[X]
			An initial password for the admin is set and can never log in without a password.	[X]
		Ability to grant admin privilege to one or more existing users: 
			A mechanism to grant admin privilege to any user-created account.	[X]
			When an admin logs in, an indication of having SM privilege is always visible.	[X]
			A normal user is not able to grant admin privilege to another user	[X]
		Ability to mark a user as “deactivated”. 
			Admin is able to mark any user account as “deactivated”.	[X]
			When a user tries to log in to an account that is marked as “deactivated”, login always fails with a message indicating that the account is disabled and provides a contact address to resolve the deactivation.	[X]
			Admin is able to remove the “deactivated” mark from any account.	[X]
			A user is able to log in to an account with the “deactivated” mark removed and perform all activities in test 3.	[X]
# Web service API: 
		Revise the API developed for lab 3 as necessary to provide required functionality. [X]
	  Application is built using a REST API.	[X]
# Administrator functionality related to copyright enforcement: 
		Create a security and privacy policy that is publicly accessible.
			Security and privacy policy available. [X]
			The above page is visible for both authenticated and unauthenticated users.	[X]
		Create an “acceptable use policy” (AUP) that is publicly accessible.
			AUP available.	[X]
			The above page is visible for both authenticated and unauthenticated users	[X]
