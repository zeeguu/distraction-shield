
function subToCompletedEvent(originalDestination) {
    events.on("generatorCompleted", function () {
        //Go to original destination
        window.location.href = originalDestination;
    });
}

