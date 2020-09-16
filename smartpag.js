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
        this.container.innerHTML += `
            <div class="smart-pag-search-box-block${this.config.id} smart-pag__search-block">
                <input type="text" name="smartPagSearch" id="smartPagSearch${this.config.id}" class="smart-pag-search-box${this.config.id} smart-pag__search-input">
             </div>
            <div id="smartPagTableBlock${this.config.id}" class="smart-pag__table-block"></div>            
        `;
        this.pagingBlock = `
            <div id="smart-pag-pagination-block${this.config.id}" class="smart-pag-pagination-block${this.config.id} smart-pag__pagination-block">
                <a id="smart-pag-pre${this.config.id}" class="smart-pag-pre${this.config.id} smart-pag-button${this.config.id} smart-pag__pre"><</a>
                    <div class="smart-pag-btns${this.config.id} smart-pag__btn" id="smartPagBtns${this.config.id}">
                    </div>
                <a  id="smart-pag-next${this.config.id}" class="smart-pag-next${this.config.id} smart-pag-button${this.config.id} smart-pag__next">></a>
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

        if (document.getElementById(`smartPagBtns${this.config.id}`)) {
            document.getElementById(`smartPagBtns${this.config.id}`).innerHTML = "";
        }
        if(!isEmpty) {
            if(this.pagesBtns > 5) {
                // console.log(1);
                newBtns += `
                    <a class="smart-pag-paginating-btn${this.config.id}  ${1} smart-pag-button${this.config.id} smart-pag__button">${1}</a>
                `;
                newBtns = this.drawShorterBtns(newBtns);
                newBtns += `
                    <a class="smart-pag-paginating-btn${this.config.id}  ${this.pagesBtns} smart-pag-button${this.config.id} smart-pag__button">${this.pagesBtns}</a>
                `;
            } else {
                // console.log(2);
                for (let i = 1; i <= this.pagesBtns; i++) {
                    newBtns += `
                        <a class="smart-pag-paginating-btn${this.config.id}  ${i} smart-pag-button${this.config.id} smart-pag__button">${i}</a>
                    `;
                }
            }
        } else {
            newBtns += `
                    <a class="smart-pag-paginating-btn${this.config.id}  ${1} smart-pag-button${this.config.id} smart-pag__button">${1}</a>
                `;
        }

        
        document.getElementById(`smartPagBtns${this.config.id}`).innerHTML = newBtns;
        for(let i = 0; i < document.getElementById(`smartPagBtns${this.config.id}`).childElementCount; i++) {
            if(document.getElementById(`smartPagBtns${this.config.id}`).children[i].classList.contains(`${this.isActiv}`)) {
                document.getElementById(`smartPagBtns${this.config.id}`).children[i].classList.add(`smart-pag-active${this.config.id}`);
            }
            else {
                document.getElementById(`smartPagBtns${this.config.id}`).children[i].classList.remove(`smart-pag-active${this.config.id}`);
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
                <div class="smart-pag-tree-points${this.config.id} smart-pag__tree-points">...</div>
            `;
        }

        for (let i = newActivStarter-1; i <= newActivStarter+1; i++) {
            newBtns += `
                <a class="smart-pag-paginating-btn${this.config.id}  ${i} smart-pag-button${this.config.id} smart-pag__button">${i}</a>
            `;
            newBeforLast=i;
        }

        if(newBeforLast != this.pagesBtns-1) {
            newBtns += `
                <div class="smart-pag-tree-points${this.config.id} smart-pag__tree-points">...</div>
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
                        hide = `smart-pag-hide${this.config.id}`;
                    }
                    if(this.config.keys[key].edit) {
                        isEditable = `smart-pag-editable${this.config.id}`;
                    }
                    let tempId = items[i].smartPagId;
                    if(this.config.keys[key].name === 'checkBox' && !items[i][this.config.keys[key].name]) {
                        // console.log(1)
                        cell += `
                        <td class="smart-pag-table-cell${this.config.id} ${hide} ${isEditable} smart-pag__table-cell smart-pag-check-box smart-pag-check-box${this.config.id}" data-key="${key}" data-item="${tempId}" }"><input type="checkbox" name="" value="">
                        </td>
                        `;
                        this.items[i].checkBox = false;
                    } else if (this.config.keys[key].name === 'checkBox') {
                        // console.log(2)
                        cell += `
                        <td class="smart-pag-table-cell${this.config.id} ${hide} ${isEditable} smart-pag__table-cell smart-pag-check-box smart-pag-check-box${this.config.id}" data-key="${key}" data-item="${tempId}" }"><input type="checkbox" checked="${this.config.keys[key].name}" name="" value="">
                        </td>
                        `;
                    } else {
                        // console.log(3)
                        cell += `
                        <td class="smart-pag-table-cell${this.config.id} ${hide} ${isEditable} smart-pag__table-cell" data-key="${key}" data-item="${tempId}" contenteditable="${this.config.keys[key].edit}">${items[i][this.config.keys[key].name] ? items[i][this.config.keys[key].name] : ""}</td>
                        `;
                    }
                }
                    newDivs += `
                <tr class="smart-pag-table-row${this.config.id} smart-pag__table-row">
                    ${cell}
                </tr>
                `;
            }
        }

        let header = "";

        this.config.keys.forEach(e =>  {
            let isHidden = "";
            if(e.hide) {
                isHidden = `smart-pag-hide${this.config.id}`;

            }
            if(e.header != null) {
                header += `
                <th class="smart-pag-table-cell${this.config.id} ${isHidden} smart-header-new-class${this.config.id} smart-pag__table-cell">${e.header}</th>
                `;
            }
        });

        


        if (document.getElementById(`smartPagTbody${this.config.id}`)) {
            document.getElementById(`smartPagTbody${this.config.id}`).innerHTML = "";
        }
        document.getElementById(`smartPagTableBlock${this.config.id}`).innerHTML = `
            <table class="smart-pag-table${this.config.id} smart-pag__table" id="smartPagTable${this.config.id}">
                <thead class="smart-pag-thead${this.config.id} smart-pag__thead" id="smartPagThead${this.config.id}">
                    <tr id="smart-header-spec${this.config.id}" class="smart-pag-table-row smart-pag__table-row">
                        ${header}
                    </tr>
                </thead>
                <tbody class="smart-pag-tbody${this.config.id} smart-pag__tbody" id="smartPagTbody${this.config.id}">
                    ${newDivs}
                </tbody>
            </table>
            <div id="smart-pag-btns-container${this.config.id}">
                ${this.pagingBlock}
            </div>
        `;
        this.drawButtons(isEmpty);
        this.addText();
        this.chnageItems();
        this.changeChecked();
    }

    

    drawTableBody(items = "") {
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
                        hide = `smart-pag-hide${this.config.id}`;
                    }
                    if(this.config.keys[key].edit) {
                        isEditable = `smart-pag-editable${this.config.id}`;
                    }
                    let tempId = items[i].smartPagId;
                    // console.log(items);
                    if(this.config.keys[key].name === 'checkBox' && !items[i][this.config.keys[key].name]) {;
                        // console.log(1)
                        cell += `
                        <td class="smart-pag-table-cell${this.config.id} ${hide} ${isEditable} smart-pag__table-cell smart-pag-check-box smart-pag-check-box${this.config.id}" data-key="${key}" data-item="${tempId}" "><input type="checkbox" name="" value="">
                        </td>
                        `;
                        this.items[i].checkBox = false;
                    } else if (this.config.keys[key].name === 'checkBox') {
                        cell += `
                        <td class="smart-pag-table-cell${this.config.id} ${hide} ${isEditable} smart-pag__table-cell smart-pag-check-box smart-pag-check-box${this.config.id}" data-key="${key}" data-item="${tempId}" "><input type="checkbox" checked="${this.config.keys[key].name}" name="" value="">
                        </td>
                        `;
                    } else {
                        // console.log(3)
                        cell += `
                        <td class="smart-pag-table-cell${this.config.id} ${hide} ${isEditable} smart-pag__table-cell" data-key="${key}" data-item="${tempId}" contenteditable="${this.config.keys[key].edit}">${items[i][this.config.keys[key].name] ? items[i][this.config.keys[key].name] : ""}</td>
                        `;
                    }
                }
                    newDivs += `
                <tr class="smart-pag-table-row${this.config.id} smart-pag__table-row">
                    ${cell}
                </tr>
                `;
            }
        }

        // let header = "";

        // this.config.keys.forEach(e =>  {
        //     let isHidden = "";
        //     if(e.hide) {
        //         isHidden = `smart-pag-hide${this.config.id}`;

        //     }
        //     if(e.header != null) {
        //         header += `
        //         <th class="smart-pag-table-cell${this.config.id} ${isHidden} smart-header-new-class${this.config.id} smart-pag__table-cell">${e.header}</th>
        //         `;
        //     }
        // });

        


        // if (document.getElementById(`smartPagTbody${this.config.id}`)) {
        //     document.getElementById(`smartPagTbody${this.config.id}`).innerHTML = "";
        // }
        document.getElementById(`smartPagTbody${this.config.id}`).innerHTML = `
            ${newDivs}
        `;

        document.getElementById(`smart-pag-btns-container${this.config.id}`).innerHTML = `
            ${this.pagingBlock}
        `;

        // console.log(this.container)

        // console.log(this.pagingBlock);
        
        this.drawButtons(isEmpty);
        this.addText();
        this.chnageItems();
        this.changeChecked();
    }



    chnageItems() {
        // TODO: set new items

        if(this.isActiv === 1) {
           document.getElementById(`smart-pag-pre${this.config.id}`).style.display = 'none';
        }

        if(this.isActiv === this.pagesBtns) {
            document.getElementById(`smart-pag-next${this.config.id}`).style.display = 'none';
         }

        document.querySelectorAll(`.smart-pag-button${this.config.id}`).forEach(e => {
            let me = this;
            e.addEventListener('click', function () {
                let event = new Event("keyup");
                if (e.id === `smart-pag-pre${me.config.id}`) {
                    if (me.starter > 0) {
                        me.starter -= me.config.pageSize;
                        me.isActiv = me.isActiv-1;
                        document.getElementById(`smartPagSearch${me.config.id}`).dispatchEvent(event);
                    }
                }
                else if (e.id === `smart-pag-next${me.config.id}`) {
                    if (me.starter < me.items.length - me.config.pageSize) {
                        me.starter += me.config.pageSize;
                        me.isActiv = me.isActiv+1;
                        document.getElementById(`smartPagSearch${me.config.id}`).dispatchEvent(event);
                    }
                }
                else if (e.parentElement.classList.contains(`smart-pag-btns${me.config.id}`)) {
                    me.starter = Number(e.textContent) * me.config.pageSize - me.config.pageSize;
                    me.isActiv = Number(e.textContent);
                    document.getElementById(`smartPagSearch${me.config.id}`).dispatchEvent(event);
                }
            });
        });

    }

    changeChecked() {
        let me = this;
        document.querySelectorAll(`.smart-pag-check-box${this.config.id}`).forEach(e => {
            e.addEventListener('change', () => {
                // console.log(e.children)
                let key = e.dataset.key;
                // this.items[e.dataset.item][this.config.keys[key].name] = e.innerText;
                this.items[e.dataset.item][this.config.keys[key].name] = e.childNodes[0].checked;
                let data = this.getData();
                this.func(data);
            });
            me.items = this.items;
        });
    }

    addText() {
            document.querySelectorAll(`.smart-pag-editable${this.config.id}`).forEach(e => {
            let me = this;
            e.addEventListener('keyup', () => {
                // console.log(e)
                let key = e.dataset.key;
                this.items[e.dataset.item][this.config.keys[key].name] = e.innerText;
                let data = this.getData();
                // console.log(data);
                this.func(data);
            });
            this.items = me.items;
        });
    }
    searchFilter() {
        let event = new Event('click');
        this.searchBox = document.getElementById(`smartPagSearch${this.config.id}`);
        document.getElementById(`smartPagSearch${this.config.id}`).addEventListener("keyup", (e)=> {
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
            this.drawTableBody(tempItems);
        });

    }
    getData() {
        return this.items;
    }
}

