Install yarn for your machine – this is the package manager that allows you to start the app/manage dependencies easily.

It may also be helpful to install npm, which is sometimes messier than yarn but is better for machinewide installs.

NEVER mix npm and yarn in a package – you can if you want but it'll take a good hour to untangle.
Rule of thumb, npm is great for the command:
npm install -g
but otherwise use yarn.


If you have yarn installed:
After pulling/cloning, navigate to the JID-0338/React Front End folder in the command line.
Type in the command:
yarn

This will then download an absolute boatload of files. This is because storing all of them on
GitHub is a bit overkill since they all need to be updated/maintained separately, and if you just type yarn
occasionally, then it's all done automatically.

Then the emulator for the browser needs to start. It's called expo (and the associated
expo-cli – command line interface). You can set it up ahead of time by entering:
npm install -g expo-cli
(You probably also have to install expo, but to be honest I can't remember if it has to be explicit, I just know it's
somewhere in the bowels of my machine.)

There will probably be some prompts, but mostly it should go well.

If you didn't do the last step you'll get warnings and probably redirected a few times,
but you'll also get more detailed instructions that in this readme, so like it's fine to be impatient.

Anyway....

Once everything is setup type:
expo start
to start the emulator in your browser! There will be a few options, but you should be able to run the scoring app!
There are other commands for starting detailed at the top of the package.json file.
The first time it starts will take a good while longer.

Feel free to send me a message if any of the steps above seem to have resulted in catastrophic and permanent damage,
or if they don't. :)