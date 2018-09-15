function Table(config) {
    function getData(url) {
        return fetch(url)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
    }

    function creteTable(data) {
        let titles = getTitles();

        function getTitles() {
            return config.colNames.length ? config.colNames : Object.keys(data[0]);
        }
        function createHead() {
            return titles.map((item) => 
            `<th data-title-name="${item}">${item}</th>`
            ).join('');
        }

        function createRow(items) {
            return titles.map((key) => {
                let value = items[key];
                if (value === undefined) {
                    value = config.defState;
                }

                return `<td>${value}</td>`;
            }).join('');
        }
        function createBody() {
            return data.map((item) => `<tr>${createRow(item)}</tr>`).join('');
        }


        let table = document.createElement('table');

        table.innerHTML = `
            <thead>${createHead()}</thead>
            <tbody>${createBody()}</tbody>      
        `;
        return table;

    }


    function sortByIndex(table, index, sortway, sortType) {
        let listSortFn = {
            asc: function (nodeA, nodeB) {
                return nodeA.children[index].innerHTML - nodeB.children[index].innerHTML;
            },
            desc: function (nodeA, nodeB) {
                return nodeB.children[index].innerHTML - nodeA.children[index].innerHTML;
            }
        }
        var tBody = table.tBodies[0];
        let sortableData = Array.from(tBody.rows)
            .sort(listSortFn[sortway])
            .forEach(function (node) {
                tBody.appendChild(node);
            })
    }

    function attachEvent(table) {
        table.addEventListener('click', function (event) {
            let node = event.target;
            if (node.tagName === 'TH' && node.closest('thead')) {
                let sortWay = node.getAttribute('data-sort');

                if (sortWay === 'asc') {
                    sortWay = 'desc';
                } else if (sortWay === 'desc') {
                    sortWay = 'asc';
                } else {
                    sortWay = 'asc';
                }
                node.setAttribute('data-sort', sortWay)

                sortByIndex(this, node.cellIndex, sortWay);
            }
        })
    }

    function render(root, data) {
        let table = creteTable(data);
        attachEvent(table);
        document.querySelector(root).appendChild(table);
    }

    this.render = function () {
        getData(config.url)
            .then(function (data) {
                let table = render(config.root, data);
                console.log(table)
            })
    }
}
