Install yarn for your machine – this is the package manager that allows you to start the app/manage dependencies easily.

It may also be helpful to install npm, which is sometimes messier than yarn but is better for machinewide installs.

Never mix npm and yarn in a package, as it can be a very time consuming process to untangle.

If you have yarn installed:
After pulling/cloning, navigate to the JID-0338/React Front End folder in the command line.
Type in the command:
`yarn`

This will then download a large amount of files. Since they all need to be updated/maintained separately, you may need to type `yarn`
occasionally, then it will be done automatically.

Then, the emulator for the browser needs to be started. It's called expo (and has the associated
expo-cli – command line interface). To set this up, enter the command:
`npm install -g expo-cli`

Follow any additional prompts.

Once everything is setup type:
`expo start`
to start the emulator in your browser! There will be a few options, but you should be able to run the scoring app!

There are other commands for starting detailed at the top of the package.json file.

The first time the emulator is started may take a few minutes, but after that, you are ready to go.
