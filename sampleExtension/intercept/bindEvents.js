/**
 * Created by pieter on 22-3-17.
 */

function subToCompletedEvent(originalDestination) {
    events.on("generatorCompleted", function () {
        //Go to original destination
        window.location.href = originalDestination;
    });
}

