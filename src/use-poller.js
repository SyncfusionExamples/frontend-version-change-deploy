import { useEffect, useState } from "react";

const SCRIPT_REJEX_MAIN = /^.*<script.*\/(main.*\.js).*$/gim;

export const UsePoller = ({ deploymentUrl }) => {
    const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false);
    useEffect(() => {
        const compareVersions = async () => {
            // request the index.html file from the deployment

            const fetchedPage = await fetch(deploymentUrl, { method: 'get', mode: 'cors' });

            // get the text from the response

            const loadedText = await fetchedPage.text();
            // get the main.js file to get hash

            const matchResponses = SCRIPT_REJEX_MAIN.exec(loadedText);

            let remoteMainScript = matchResponses.length > 0 ? matchResponses[1] : undefined;

            if (remoteMainScript === undefined) {
                console.log("Could not find main script in index.html");
                setIsNewVersionAvailable(false);
                return;
            }

            // get the current version hash from current deployment

            let currentMainScript = undefined;

            // get text representation of document

            const scriptTags = document.head.getElementsByTagName('script');
            for (let i = 0; i < scriptTags.length; i++) {
                const scriptTag = scriptTags[i];
                currentMainScript = /^.*\/(main.*\.js).*$/gim.exec(scriptTag.src) === null ? undefined : /^.*\/(main.*\.js).*$/gim.exec(scriptTag.src)[1];
            }

            // if the current main script, or the remote main script is undefined, we can't compare
            // but if they are there, compare them

            setIsNewVersionAvailable(
                !!currentMainScript && !!remoteMainScript && currentMainScript !== remoteMainScript
            );

           
        }

        // compare versions every 5 seconds

        const createdInterval = setInterval(compareVersions, 5000);

        return () => {
            // clear the interval when the component unmounts

            clearInterval(createdInterval)
        };
    }, [deploymentUrl]);

    // return the state

    return { isNewVersionAvailable };
}