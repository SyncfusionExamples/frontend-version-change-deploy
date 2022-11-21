import { useEffect, useState } from "react";

export const UsePoller = ({ deploymentUrl }) => {
    const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false);
    useEffect(() => {
        const compareVersions = async () => {
            // request the index.html file from the deployment

            const fetchedPage = await fetch(deploymentUrl, { method: 'get', mode: 'cors' });

            // get the text from the response

            const loadedText = await fetchedPage.text();

            // get the main.js file to get hash

            const matchResponses = /^.*<script.*\/(main.*\.js).*$/.exec(loadedText);

            let remoteMainScript = matchResponses.length > 1 ? matchResponses[1] : undefined;
            if (remoteMainScript === undefined) {
                console.log("Could not find main script in index.html");
                setIsNewVersionAvailable(false);
                return;
            }

            // get the current version hash from current deployment

            let currentMainScript = undefined;

            // locate all script tags in current body

            const allScripsInCurrentDeployment = document.body.getElementsByTagName('script');

            // loop through all script tags and find the one that matches the main script

            for (const script of allScripsInCurrentDeployment) {

                // if the script src contains the main script name, we have a match

                let scriptRegexMatch = /^.*\/(main.*\.js).*$/gim.exec(script.src);
                if (!scriptRegexMatch || scriptRegexMatch.length < 2) {
                    // no match, continue

                    continue;
                }

                // we have a match, get the script name

                currentMainScript = scriptRegexMatch[1] === null ? undefined : scriptRegexMatch[1];
            }

            // if the current main script, or the remote main script is undefined, we can't compare
            // but if they are there, compare them

            setIsNewVersionAvailable(!!currentMainScript && !!remoteMainScript && currentMainScript !== remoteMainScript);
        }

        // compare versions every 5 seconds

        const createdInterval = setInterval(compareVersions, 5000);

        return () => {
            // clear the interval when the component unmounts

            clearInterval(createdInterval)
        };
    }, []);

    // return the state

    return { isNewVersionAvailable };
}