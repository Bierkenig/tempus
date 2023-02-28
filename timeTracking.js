"use strict";

let tags = ['School', 'Private'];
let entries = [
    {
        description: 'WEBT macht mich fertig',
        start: new Date("2021-01-01T12:00:00Z"),
        end: new Date("2021-01-01T13:00:00Z"),
        tagId: 0,
    },
    {
        description: 'Gatze streicheln',
        start: new Date("2021-01-01T14:00:00Z"),
        end: new Date("2021-01-01T15:00:00Z"),
        tagId: 1,
    },
    {
        description: 'Alpha',
        start: new Date("2020-01-01T14:00:00Z"),
        end: new Date("2020-01-01T15:00:00Z"),
        tagId: 1,
    },
    {
        description: 'Beta',
        start: new Date("2024-01-01T14:00:00Z"),
        end: new Date("2024-01-01T15:00:00Z"),
        tagId: 1,
    },
];
let lastSort;
let doubleLastSort = false;
let entryInputs = {
    description: document.getElementById('newTimeTrackingEntryDescription'),
    start: document.getElementById('newTimeTrackingEntryStart'),
    end: document.getElementById('newTimeTrackingEntryEnd'),
    tag: document.getElementById('newTimeTrackingEntryTag'),
}
let listHeadColumns = {
    description: document.getElementById('timeTrackingListHeadDescription'),
    start: document.getElementById('timeTrackingListHeadStart'),
    end: document.getElementById('timeTrackingListHeadEnd'),
    tag: document.getElementById('timeTrackingListHeadTag'),
}
let tagFilterSelect = document.getElementById('tagFilterSelect');
let dateFilterInput = document.getElementById('dateFilterInput');

setup();

function setup() {
    updateTagSuggestions();
    renderList();
    document.getElementById('newTimeTrackingEntryButton').addEventListener('click', addListEntry);
    document.getElementById('clearTimeTrackingEntryButton').addEventListener('click', clearEntryInputs);
    listHeadColumns.description.addEventListener('click', sortByDescription);
    listHeadColumns.start.addEventListener('click', sortByStartDate);
    listHeadColumns.end.addEventListener('click', sortByEndDate);
    listHeadColumns.tag.addEventListener('click', sortByTag);
    tagFilterSelect.addEventListener('change', renderList);
    dateFilterInput.addEventListener('change', renderList);
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
}

// CONTINUE HERE (CHECK DATE FILTER)
function renderList() {
    let list = document.getElementById('timeTrackingListContent');
    list.innerHTML = '';
    for (let [index, entry] of entries.entries()) {
        if (tagFilterSelect.value === 'placeholder' || tagFilterSelect.value === tags[entry.tagId]) {
            if (dateFilterInput.value === '' /* OR startdate = datefilter OR end = datefilter (only day, not time) */) {
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

                let deleteButton = document.createElement('button');
                deleteButton.setAttribute('type', 'button');
                deleteButton.addEventListener('click', function () {
                    deleteListEntry(entry)
                });
                deleteButton.textContent = 'Delete';

                let deleteButtonContainer = document.createElement('div');
                deleteButtonContainer.setAttribute('class', 'timeTrackingListElementColumn flexGrow1');
                deleteButtonContainer.appendChild(deleteButton)

                listElement.appendChild(description);
                listElement.appendChild(start);
                listElement.appendChild(end);
                listElement.appendChild(tag);
                listElement.appendChild(deleteButtonContainer);

                list.appendChild(listElement);
            }
        }
    }
}

function updateTagSuggestions() {
    let suggestionDataList = document.getElementById('newTimeTrackingEntryTagList');
    suggestionDataList.innerHTML = '';
    tagFilterSelect.innerHTML = '';

    let tagFilterPlaceholder = document.createElement('option');
    tagFilterPlaceholder.setAttribute('id', 'tagFilterPlaceholder');
    tagFilterPlaceholder.setAttribute('value', 'placeholder');
    tagFilterPlaceholder.setAttribute('selected', 'true');
    tagFilterPlaceholder.setAttribute('disabled', 'true');
    tagFilterPlaceholder.textContent = 'Select Tag';
    tagFilterSelect.appendChild(tagFilterPlaceholder);

    for (let [index, tag] of tags.entries()) {
        let tagSuggestion = document.createElement('option');
        tagSuggestion.setAttribute('id', index + 'newTimeTrackingEntryTagSuggestion');
        tagSuggestion.setAttribute('value', tag);
        suggestionDataList.appendChild(tagSuggestion);

        let tagFilter = document.createElement('option');
        tagFilter.setAttribute('id', index + 'tagFilter');
        tagFilter.setAttribute('value', tag);
        tagFilter.textContent = tag;
        tagFilterSelect.appendChild(tagFilter);
    }
}

function addListEntry() {
    let description = entryInputs.description.value;
    let start = entryInputs.start.value;
    let end = entryInputs.end.value;
    let tag = entryInputs.tag.value;
    if (description === '' || start === '' || end === '' || tag === '') {
        alert('No empty fields allowed!')
    } else {
        if (!tags.includes(tag)) {
            tags.push(tag);
            updateTagSuggestions();
        }
        entries.push({
            description: description,
            start: new Date(start + ":00Z"),
            end: new Date(end + ":00Z"),
            tagId: tags.indexOf(tag),
        });
        renderList();
        clearEntryInputs();
    }
}

function deleteListEntry(entry) {
    for (let [index, checkEntry] of entries.entries()) {
        if (checkEntry === entry && confirm('Delete "' + entry.description + '"?')) {
            entries.splice(index, 1);
            break
        }
    }
    renderList();
}

function clearEntryInputs() {
    for (let [key, entryInput] of Object.entries(entryInputs)) {
        entryInput.value = '';
    }
    setSortIcons(null)
}

function resetFilters() {
    updateTagSuggestions();
    dateFilterInput.value = '';
    renderList();
    setSortIcons(null)
}

function sortByDescription() {
    sortEntries('description');
}

function sortByStartDate() {
    sortEntries('start');
}

function sortByEndDate() {
    sortEntries('end');
}

function sortByTag() {
    sortEntries('tag');
}

function sortEntries(property) {
    let listHeadColumn = listHeadColumns[property];
    switch (property) {
        case 'description':
            entries.sort(compareDescription);
            break;
        case 'start':
            entries.sort(compareStartDate);
            break;
        case 'end':
            entries.sort(compareEndDate);
            break;
        case 'tag':
            entries.sort(compareTag);
            break;
        default:
            break;
    }
    if (lastSort === property && !doubleLastSort) {
        entries.reverse();
        doubleLastSort = true;
    } else {
        doubleLastSort = false;
    }
    lastSort = property;
    renderList();
    setSortIcons(property);
}

function setSortIcons(property) {
    for (let [key, listHeadColumn] of Object.entries(listHeadColumns)) {
        let newListHeadColumn = listHeadColumn.textContent.split('');
        if (listHeadColumn.textContent.toLowerCase().includes(property)) {
            if (doubleLastSort) {
                newListHeadColumn[0] = '▲';
            } else {
                newListHeadColumn[0] = '▼';
            }
        } else {
            newListHeadColumn[0] = '►';
        }
        listHeadColumn.textContent = newListHeadColumn.join('');
    }
}

function compareDescription(a, b) {
    if (a.description < b.description) {
        return -1;
    }
    if (a.description > b.description) {
        return 1;
    }
    return 0;
}

function compareStartDate(a, b) {
    if (a.start < b.start) {
        return -1;
    }
    if (a.start > b.start) {
        return 1;
    }
    return 0;
}

function compareEndDate(a, b) {
    if (a.end < b.end) {
        return -1;
    }
    if (a.end > b.end) {
        return 1;
    }
    return 0;
}

function compareTag(a, b) {
    if (tags[a.tagId] < tags[b.tagId]) {
        return -1;
    }
    if (tags[a.tagId] > tags[b.tagId]) {
        return 1;
    }
    return 0;
}