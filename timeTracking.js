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
        end: new Date("2024-01-01T15:10:00Z"),
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
    duration: document.getElementById('timeTrackingListHeadDuration'),
    tag: document.getElementById('timeTrackingListHeadTag'),
}
let listFooterColumns = {
    count: document.getElementById('timeTrackingListFooterCount'),
    totalHours: document.getElementById('timeTrackingListFooterTotalHours'),
}
let tagFilterSelect = document.getElementById('tagFilterSelect');
let dateFilterInput = document.getElementById('dateFilterInput');

setup()

function setup() {
    localStorage.getItem('entries') !== undefined && localStorage.getItem('entries') !== null ? entries = getConvertedEntries(JSON.parse(localStorage.getItem('entries'))) : ""
    localStorage.getItem('tags') !== undefined && localStorage.getItem('tags') !== null ? tags = JSON.parse(localStorage.getItem('tags')) : ""
    updateTagSuggestions();
    renderList();
    entryInputs.start.addEventListener('focus', setStartInputType);
    entryInputs.end.addEventListener('focus', setEndInputType);
    document.getElementById('newTimeTrackingEntryButton').addEventListener('click', addListEntry);
    document.getElementById('clearTimeTrackingEntryButton').addEventListener('click', clearEntryInputs);
    listHeadColumns.description.addEventListener('click', sortByDescription);
    listHeadColumns.start.addEventListener('click', sortByStartDate);
    listHeadColumns.end.addEventListener('click', sortByEndDate);
    listHeadColumns.duration.addEventListener('click', sortByDuration);
    listHeadColumns.tag.addEventListener('click', sortByTag);
    dateFilterInput.addEventListener('focus', setFilterInputType);
    tagFilterSelect.addEventListener('change', renderList);
    dateFilterInput.addEventListener('change', renderList);
    tagFilterSelect.addEventListener('change', setFilterIndicator);
    dateFilterInput.addEventListener('change', setFilterIndicator);
    tagFilterSelect.addEventListener('change', setTagFilterColor);
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
    document.getElementById('filterIndicator').addEventListener('click', resetFilters);
    setTagFilterColor(null, true);
}

function renderList() {
    let list = document.getElementById('timeTrackingListContent');
    list.innerHTML = '';
    let totalHours = 0;
    let currentViewCount = 0;
    for (let [index, entry] of entries.entries()) {
        let dateFilter = new Date(dateFilterInput.value);
        let dateFilterString = dateFilter.getFullYear() + '-' + dateFilter.getMonth() + '-' + dateFilter.getDate();
        let startDateString = entry.start.getFullYear() + '-' + entry.start.getMonth() + '-' + entry.start.getDate();
        let endDateString = entry.end.getFullYear() + '-' + entry.end.getMonth() + '-' + entry.end.getDate();
        if (tagFilterSelect.value === 'placeholder' || tagFilterSelect.value === tags[entry.tagId]) {
            if (dateFilterInput.value === '' || dateFilterString === startDateString || dateFilterString === endDateString) {
                let listElement = document.createElement('div');
                listElement.setAttribute('id', index + 'timeTrackingListElement');
                listElement.setAttribute('class', 'timeTrackingListElement lightBackground');

                let description = document.createElement('div');
                description.setAttribute('class', 'timeTrackingListElementColumn flexGrow5');
                description.textContent = entry.description;

                let start = document.createElement('div');
                start.setAttribute('class', 'timeTrackingListElementColumn flexGrow3');
                start.textContent = entry.start.toLocaleString('de-DE');

                let end = document.createElement('div');
                end.setAttribute('class', 'timeTrackingListElementColumn flexGrow3');
                end.textContent = entry.end.toLocaleString('de-DE');

                let duration = document.createElement('div');
                duration.setAttribute('class', 'timeTrackingListElementColumn flexGrow2');
                let hours = Math.abs(entry.end - entry.start) / (1000 * 60 * 60);
                totalHours += hours;
                duration.textContent = formatDuration(hours);

                let tag = document.createElement('div');
                tag.setAttribute('class', 'timeTrackingListElementColumn flexGrow2');
                tag.textContent = tags[entry.tagId];

                let deleteButton = document.createElement('button');
                deleteButton.setAttribute('type', 'button');
                deleteButton.setAttribute('class', 'deleteButton');
                deleteButton.addEventListener('click', function () {
                    deleteListEntry(entry)
                });
                deleteButton.textContent = 'Delete';

                let deleteButtonContainer = document.createElement('div');
                deleteButtonContainer.setAttribute('class', 'timeTrackingListElementColumn timeTrackingListElementActionColumn flexGrow1');
                deleteButtonContainer.appendChild(deleteButton);

                listElement.appendChild(description);
                listElement.appendChild(start);
                listElement.appendChild(end);
                listElement.appendChild(duration);
                listElement.appendChild(tag);
                listElement.appendChild(deleteButtonContainer);

                list.appendChild(listElement);
                currentViewCount++;
            }
        }
    }
    listFooterColumns.count.textContent = currentViewCount + ' Elements';
    listFooterColumns.totalHours.textContent = 'Total: ' + formatDuration(totalHours);
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
    tagFilterPlaceholder.textContent = 'Select tag';
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
    persistData()
}

function deleteListEntry(entry) {
    for (let [index, checkEntry] of entries.entries()) {
        if (checkEntry === entry && confirm('Delete "' + entry.description + '"?')) {
            entries.splice(index, 1);
            break
        }
    }
    renderList();
    persistData()
}

function clearEntryInputs() {
    for (let [key, entryInput] of Object.entries(entryInputs)) {
        entryInput.value = '';
    }
    setSortIcons(null)
    setStartInputType(false);
    setEndInputType(false);
}

function resetFilters() {
    updateTagSuggestions();
    dateFilterInput.value = '';
    renderList();
    setSortIcons(null);
    setFilterIndicator(false);
    setFilterInputType(false);
    setTagFilterColor(null, true);
}

function setFilterIndicator(active = true) {
    let indicator = document.getElementById('filterIndicator');
    if (active) {
        indicator.setAttribute('class', 'filterIndicatorActive');
        indicator.textContent = 'Active';
    } else {
        indicator.setAttribute('class', 'filterIndicatorInactive');
        indicator.textContent = 'Inactive';
    }
}

function setStartInputType(date = true) {
    if (date) {
        entryInputs.start.type = 'datetime-local';
    } else {
        entryInputs.start.type = 'text';
    }
}

function setEndInputType(date = true) {
    if (date) {
        entryInputs.end.type = 'datetime-local';
    } else {
        entryInputs.end.type = 'text';
    }
}

function setFilterInputType(date = true) {
    if (date) {
        dateFilterInput.type = 'date';
    } else {
        dateFilterInput.type = 'text';
    }
}

function setTagFilterColor(event, grey = false) {
    if (grey) {
        tagFilterSelect.style.color = 'rgba(255, 255, 255, 0.4)';
    } else {
        tagFilterSelect.style.color = 'white';
    }
}

function formatDuration(duration) {
    return (Math.round((duration + Number.EPSILON) * 100) / 100).toString() + ' h'
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

function sortByDuration() {
    sortEntries('duration');
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
        case 'duration':
            entries.sort(compareDuration);
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

function persistData() {
    localStorage.setItem('entries', JSON.stringify(entries))
    localStorage.setItem('tags', JSON.stringify(tags))
}

function getConvertedEntries(entries) {
    entries.forEach((el) => {
        el.end = new Date(el.end)
        el.start = new Date(el.start)
    })
    return entries
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

function compareDuration(a, b) {
    let aDuration = Math.abs(a.end - a.start) / (1000 * 60 * 60);
    let bDuration = Math.abs(b.end - b.start) / (1000 * 60 * 60);
    if (aDuration < bDuration) {
        return -1;
    }
    if (aDuration > bDuration) {
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