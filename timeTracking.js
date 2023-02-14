"use strict";

let tags = ['School', 'Private'];
let entries = [
    {
        description: 'Balalalala',
        start: new Date("2021-01-01T12:00:00Z"),
        end: new Date("2021-01-01T13:00:00Z"),
        tagId: 0,
    },
    {
        description: 'Balalalalalalalalalal',
        start: new Date("2021-01-01T14:00:00Z"),
        end: new Date("2021-01-01T15:00:00Z"),
        tagId: 1,
    },
];

renderList();
updateTagSuggestions();
document.getElementById('newTimeTrackingEntryButton').addEventListener('click', addListEntry);

function renderList() {
    let list = document.getElementById('timeTrackingListContent');
    list.innerHTML = '';
    for (let [index, entry] of entries.entries()) {
        let listElement = document.createElement('div');
        listElement.setAttribute('id', index + 'timeTrackingListElement');
        listElement.setAttribute('class', 'timeTrackingListElement');

        let description = document.createElement('div');
        description.setAttribute('class', 'timeTrackingListElementColumn flexGrow3');
        description.textContent = entry.description;

        let start = document.createElement('div');
        start.setAttribute('class', 'timeTrackingListElementColumn flexGrow2');
        start.textContent = entry.start.toLocaleString('de-DE');

        let end = document.createElement('div');
        end.setAttribute('class', 'timeTrackingListElementColumn flexGrow2');
        end.textContent = entry.end.toLocaleString('de-DE');

        let tag = document.createElement('div');
        tag.setAttribute('class', 'timeTrackingListElementColumn flexGrow1');
        tag.textContent = tags[entry.tagId];

        listElement.appendChild(description);
        listElement.appendChild(start);
        listElement.appendChild(end);
        listElement.appendChild(tag);

        list.appendChild(listElement);
    }
}

function updateTagSuggestions() {
    let suggestionDataList = document.getElementById('newTimeTrackingEntryTagList');
    for (let [index, tag] of tags.entries()) {
        let tagSuggestion = document.createElement('option');
        tagSuggestion.setAttribute('id', index + 'newTimeTrackingEntryTagSuggestion');
        tagSuggestion.setAttribute('value', tag);
        suggestionDataList.appendChild(tagSuggestion);
    }
}

function addListEntry() {
    let description = document.getElementById('newTimeTrackingEntryDescription').value;
    let start = document.getElementById('newTimeTrackingEntryStart').value;
    let end = document.getElementById('newTimeTrackingEntryEnd').value;
    let tag = document.getElementById('newTimeTrackingEntryTag').value;
    console.log(description);
    console.log(start);
    console.log(end);
    console.log(tag);
    // CONTINUE HERE
    // UPDATE TAGS IF NEW TAG IS ENTERED
}