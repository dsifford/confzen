import { box, list as List, textbox } from 'blessed';
import { screen } from './';

const container = box({
    height: '100%',
    width: 'half',
});

const searchBar = textbox({
    bottom: '0',
    height: 'shrink',
    parent: container,
    width: '100%',
});

const list = List(<any>{
    border: 'line',
    height: '60%',
    keys: true,
    parent: container,
    search: callback => {
        container.append(searchBar);
        searchBar.readInput((err, value) => {
            if (err) { return; }
            searchBar.clearValue();
            container.remove(searchBar);
            list._.lastSearch = value;
            callback(value);
        });
        screen.render();
    },
    style: {
        focus: {
            border: {
                fg: 'blue',
            },
        },
        selected: {
            bg: 'yellow',
            bold: true,
            fg: 'black',
        },
    },
    tags: true,
    vi: true,
});

const descriptionText = box(<any>{
    border: 'line',
    content: '',
    height: '40%',
    label: 'Description',
    parent: container,
    tags: true,
    top: '60%',
    wrap: true,
});

list.on('select item', item => screen.emit('descriptionChange', item.getText()));
list.on('select', item => screen.emit('fieldSelected', item.getText()));
list.on('re-query', (backwards = false) => {
    if (!list._.lastSearch) { return; }
    list.select((<any>list).fuzzyFind(list._.lastSearch, backwards));
    list.screen.render();
});

list.key(['backspace', 'h'], () => screen.emit('paginate'));
list.key('tab', () => screen.emit('focus-pane', 'preview'));
list.key('n', () => list.emit('re-query'));
list.key('S-n', () => list.emit('re-query', true));

export default {
    list,
    descriptionText,
    container,
};
