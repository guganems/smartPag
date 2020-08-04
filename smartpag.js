class SmartPag {
    constructor(items, config) {
        this.config = config;
        this.items = items;
        this.pagesBtns = Math.ceil(this.items.length / this.config.pageSize);
        this.starter = 0;
        this.init();
    }

    init() {
        // TODO: initialization of the first page
        this.container = document.getElementById('container');

        // TODO: add buttons
        this.drawTable();

        let newBtns = ``;
        for (let i = 1; i <= this.pagesBtns; i++) {
            newBtns += `
                <button style="margin: 0 5px" class="${i}">${i}</button>
            `;
        }

        this.container.innerHTML += `
            <div class="smart-pag-pagination-block">
                <button class="pre">pre</button>
                    <div class="btns">
                        ${newBtns}
                    </div>
                <button class="next">next</button>
            </div>
        `;

        this.chnageItems();
        this.addText();
        this.searchFilter();
    }

    drawTable() {
        // TODO: draws it
        let newDivs = ``;
        for (let i = this.starter; i < this.starter + this.config.pageSize; i++) {
            if (i < this.items.length) {
                let cell = "";
                for (let key = 0; key < this.config.keys.length; key++) {
                    let hide = "";
                    let isEditable = "";
                    if (this.config.keys[key].hide) {
                        hide = "smart-pag-hide";
                    }
                    if(this.config.keys[key].edit) {
                        isEditable = "smart-pag-editable";
                    }
                    cell += `
                        <td class="smart-pag-table-cell ${hide} ${isEditable}" data-key="${key}" data-item="${i}" contenteditable="${this.config.keys[key].edit}">${this.items[i][this.config.keys[key].name] ? this.items[i][this.config.keys[key].name] : ""}</td>
                    `
                }
                newDivs += `
                <tr class="smart-pag-table-row">
                    ${cell}
                </tr>
            `;
            }
        }

        let header = "";

        this.config.keys.forEach(e =>  {
            let isHidden = "";
            if(e.hide) {
                isHidden = "smart-pag-hide";

            }
            header += `
                <th class="smart-pag-table-cell ${isHidden}">${e.header}</th>
            `;
        });


        this.container.innerHTML = `
             <div class="smart-pag-search-box-block">
                <input type="text" name="smartPagSearch" id="smartPagSearch" class="smart-pag-search-box">
             </div>
             <div class="smart-pag-table-block">
                <table class="smart-pag-table" id="smartPagTable">
                    <thead class="smar-pag-thead">
                        <tr class="smart-pag-table-row">
                            ${header}
                        </tr>
                    </thead>
                    <tbody class="smart-pag-tbody" id="smartPagTbody">
                        ${newDivs}
                    </tbody>
                </table>
             </div>
        `;
    }


    chnageItems() {
        // TODO: set new items

        document.querySelectorAll('button').forEach(e => {
            let me = this;
            e.addEventListener('click', function () {
                if (e.classList.contains('pre')) {
                    if (me.starter > 0) {
                        me.starter -= me.config.pageSize;
                        me.init();
                    }
                }
                else if (e.classList.contains('next')) {
                    if (me.starter < me.items.length - me.config.pageSize) {
                        me.starter += me.config.pageSize;
                        me.init();
                    }
                }
                else if (e.parentElement.classList.contains('btns')) {
                    me.starter = Number(e.textContent) * me.config.pageSize - me.config.pageSize;
                    me.init();
                }
            });
        });

    }

    addText() {
            document.querySelectorAll('.smart-pag-editable').forEach(e => {
            let me = this;
            e.addEventListener('keyup', () => {
                let key = e.dataset.key;
                this.items[e.dataset.item][this.config.keys[key].name] = e.innerText;
            });
            this.items = me.items;
            // console.log(this.items);
        });
    }
    searchFilter() {
        this.searchBox = document.getElementById("smartPagSearch");
        let tbody =  document.getElementById("smartPagTbody");
        this.searchBox.addEventListener("keyup", function () {
            console.log(tbody)
        });
    }

}

