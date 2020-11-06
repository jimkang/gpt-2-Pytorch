# Hacky scripts

Here's a very hacky script for running GPT-2 on text copied from a Slack conversation.

`clean-slack-paste` cleans up whatever you pipe into it via stdin and converts it into a bash script that will run `main.py` on the cleaned contents.

Usage example:

    cat food-aa|node clean-slack-paste.js > aa.sh && chmod u+x aa.sh && ./aa.sh > aa-out.txt

Here, `food-aa` is a text file with text copied from Slack. The generate script is run, then saved to `aa-out.txt`.

GPT-2 (or main.py specifically) doesn't seem to like more than about 30 lines of text. So, I'd split the raw transcript like so:

    split -l 80 food.txt food

It produces 80-line files, and you'll end up with around 30 after all the filtering.
