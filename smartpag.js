class SmartPag {
    constructor(items, config) {
        this.config = config;
        this.items = items;
        this.pagesBtns = Math.ceil(this.items.length / this.config.quantity);
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
            <div style="display: flex; padding-top: 5px">
                <button class="pre">pre</button>
                    <div class="btns">
                        ${newBtns}
                    </div>
                <button class="next">next</button>
            </div>
        `;

        this.chnageItems();
        this.addText();
    }

    drawTable() {
        // TODO: draws it
        let newDivs = ``;
        for (let i = this.starter; i < this.starter + this.config.quantity; i++) {
            if (i < this.items.length) {
                newDivs += `
                <div style="display: flex; margin: 5px 0">
                    <p style="margin: 0 5px">${this.items[i][this.config.keys[0]]}</p>
                    <p style="margin: 0 5px">${this.items[i][this.config.keys[1]]}</p>
                    <div class="table-cell" data-item="${i}" contenteditable="true" style="width: 100px; height: 20px; background: red">${this.items[i][this.config.keys[2]] ? this.items[i][this.config.keys[2]] : ""}</div>
                </div>
            `;
            }
        }

        this.container.innerHTML = `
            <div style="">
                <div style="display: flex">
                    <h3 style="margin: 5px">${this.config.headers[0]}</h3>
                    <h3 style="margin: 5px">${this.config.headers[1]}</h3>
                </div>
                ${newDivs}
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
                        me.starter -= me.config.quantity;
                        me.init();
                    }
                }
                else if (e.classList.contains('next')) {
                    if (me.starter < me.items.length - me.config.quantity) {
                        me.starter += me.config.quantity;
                        me.init();
                    }
                }
                else if (e.parentElement.classList.contains('btns')) {
                    me.starter = Number(e.textContent) * me.config.quantity - me.config.quantity;
                    me.init();
                }
            });
        });

    }

    addText() {
            document.querySelectorAll('.table-cell').forEach(e => {
            let me = this;
            e.addEventListener('keyup', () => {
                this.items[e.dataset.item].this.config[2] = e.innerText;
            });
            this.items = me.items;
            // console.log(this.items);
        });
    }

}

