class SmartPag {
    constructor(items, config, func) {
        this.config = config;
        this.items = [...items];
        this.starter = 0;
        this.isActiv = 1;
        this.searchVal = "";
        this.func = func;
        this.init();
    }

    init() {
        this.smartPagMap();
        this.container = document.getElementById(this.config.parentDiv);
        this.container.innerHTML = `
            <div class="smart-pag-search-box-block">
                <input type="text" name="smartPagSearch" id="smartPagSearch" class="smart-pag-search-box">
             </div>
            <div id="smartPagTableBlock"></div>            
        `;
        this.pagingBlock = `
            <div class="smart-pag-pagination-block">
                <button class="smart-pag-pre smart-pag-button"><</button>
                    <div class="smart-pag-btns" id="smartPagBtns">
                    </div>
                <button class="smart-pag-next smart-pag-button">></button>
            </div>
        `;
        this.drawTable(this.items);
        this.searchFilter();
    }
    smartPagMap() {
        this.items = this.items.map((el, idx) => {
            el.smartPagId = idx;
            return el;
        });
    }
    drawButtons(isEmpty) {
        let newBtns = ``;

        if (document.getElementById('smartPagBtns')) {
            document.getElementById('smartPagBtns').innerHTML = "";
        }
        if(!isEmpty) {
            if(this.pagesBtns > 5) {
                console.log(1);
                newBtns += `
                    <button class="smart-pag-paginating-btn  ${1} smart-pag-button">${1}</button>
                `;
                newBtns = this.drawShorterBtns(newBtns);
                newBtns += `
                    <button class="smart-pag-paginating-btn  ${this.pagesBtns} smart-pag-button">${this.pagesBtns}</button>
                `;
            } else {
                console.log(2);
                for (let i = 1; i <= this.pagesBtns; i++) {
                    newBtns += `
                        <button class="smart-pag-paginating-btn  ${i} smart-pag-button">${i}</button>
                    `;
                }
            }
        } else {
            newBtns += `
                    <button class="smart-pag-paginating-btn  ${1} smart-pag-button">${1}</button>
                `;
        }

        
        document.getElementById('smartPagBtns').innerHTML = newBtns;
        for(let i = 0; i < document.getElementById('smartPagBtns').childElementCount; i++) {
            if(document.getElementById('smartPagBtns').children[i].classList.contains(`${this.isActiv}`)) {
                document.getElementById('smartPagBtns').children[i].classList.add('smart-pag-active');
            }
            else {
                document.getElementById('smartPagBtns').children[i].classList.remove('smart-pag-active');
            }
        }
        // this.drawActiveButton();
    
    }

    drawShorterBtns(newBtns) {
        let newActivStarter = this.isActiv;
        let newBeforLast;
        
        if(newActivStarter < 3) {
            while(newActivStarter !== 3) {
                newActivStarter++;
            }
        }

        if(newActivStarter > this.pagesBtns-2) {
            while(newActivStarter !== this.pagesBtns-2) {
                newActivStarter--;
            }
        }

        if(newActivStarter-1 != 2) {
            newBtns += `
                <div class="smart-pag-tree-points">...</div>
            `;
        }

        for (let i = newActivStarter-1; i <= newActivStarter+1; i++) {
            newBtns += `
                <button class="smart-pag-paginating-btn  ${i} smart-pag-button">${i}</button>
            `;
            newBeforLast=i;
        }

        if(newBeforLast != this.pagesBtns-1) {
            newBtns += `
                <div class="smart-pag-tree-points">...</div>
            `;
        }

        return newBtns;
    }


    drawTable(items = "") {
        // TODO: draws it
        let isEmpty = items.length<=0;
        let newDivs = ``;
        for (let i = this.starter; i < this.starter + this.config.pageSize; i++) {
            if (i < items.length) {
                let count = items.length;
                this.pagesBtns = Math.ceil(count / this.config.pageSize);
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
                    let tempId = items[i].smartPagId;
                    // console.log(items);
                    cell += `
                        <td class="smart-pag-table-cell ${hide} ${isEditable}" data-key="${key}" data-item="${tempId}" contenteditable="${this.config.keys[key].edit}">${items[i][this.config.keys[key].name] ? items[i][this.config.keys[key].name] : ""}</td>
                    `;
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


        if (document.getElementById('smartPagTableBlock')) {
            document.getElementById('smartPagTableBlock').innerHTML = "";
        }
        document.getElementById('smartPagTableBlock').innerHTML = `
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
             ${this.pagingBlock}
        `;
        this.drawButtons(isEmpty);
        this.addText();
        this.chnageItems();
    }
    chnageItems() {
        // TODO: set new items

        document.querySelectorAll('.smart-pag-button').forEach(e => {
            let me = this;
            e.addEventListener('click', function () {
                let event = new Event("keyup");
                if (e.classList.contains('smart-pag-pre')) {
                    if (me.starter > 0) {
                        me.starter -= me.config.pageSize;
                        me.isActiv = me.isActiv-1;
                        document.getElementById('smartPagSearch').dispatchEvent(event);
                    }
                }
                else if (e.classList.contains('smart-pag-next')) {
                    if (me.starter < me.items.length - me.config.pageSize) {
                        me.starter += me.config.pageSize;
                        me.isActiv = me.isActiv+1;
                        document.getElementById('smartPagSearch').dispatchEvent(event);
                    }
                }
                else if (e.parentElement.classList.contains('smart-pag-btns')) {
                    me.starter = Number(e.textContent) * me.config.pageSize - me.config.pageSize;
                    me.isActiv = Number(e.textContent);
                    document.getElementById('smartPagSearch').dispatchEvent(event);
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
                let data = this.getData();
                this.func(data);
            });
            this.items = me.items;
        });
    }
    searchFilter() {
        let event = new Event('click');
        this.searchBox = document.getElementById("smartPagSearch");
        document.getElementById('smartPagSearch').addEventListener("keyup", (e)=> {
            this.searchVal = this.searchBox.value;
            let tempItems = this.items.filter(el => {
                for (let prop of this.config.keys) {
                    if (prop.searchable) {
                        let searchable = `${el[prop.name]} `;
                        if (searchable.includes(this.searchVal)) return true;
                   }
                }
            });

            if(e.keyCode) {
                this.starter = 0;
                this.isActiv = 1;
                this.searchBox.dispatchEvent(event);
            }
            this.drawTable(tempItems);
        });

    }
    getData() {
        return this.items;
    }
}

