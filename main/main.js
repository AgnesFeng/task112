    console.log("Debug Info");

    let arrBuy = [];
    let arrFree = [];
    let cutPrice = 0;
    let sum = 0;
    let objBuy = {name:"name",
        num: 1,
        price:0,
        unit:'unit',
        sumPrice:0
    };
    let objFree = {name:"name",
        num: 1,
        unit:'unit',
    };

        function main(inputs) {
            let obj = {};
            //inputs.reduce(function (pre,tempInput) { }   //不可以用reduce，因为每次只比较了两个,num会一直是3
            for (var i = 0; i < inputs.length; i++) {
                obj = loadAllItems().filter(function (temp) {
                    return (temp.barcode === inputs[i].slice(0,10))
                });
                if(inputs[i].length ===10){
                    if (inputs[i] === inputs[i+1]) {
                        objBuy.num += 1;
                    }else{
                        arrBuy.push({name:obj[0].name,
                            num: objBuy.num,
                            price:obj[0].price,
                            unit:obj[0].unit,
                            sumPrice:obj[0].price*(objBuy.num + 1)
                        });
                        objBuy.num = 1;
                    }
                }
                else{ //按斤称的商品
                    //console.log(inputs[i].slice(11,12));
                    arrBuy.push({name:obj[0].name,
                        num:parseInt(inputs[i].slice(11,12)),
                        price:obj[0].price,
                        unit:obj[0].unit,
                        sumPrice:obj[0].price*(objBuy.num + 1)
                    });
                }
            }
            //console.log(arrBuy);
            //计算折扣 he 总价 输入：arrBuy，输出：减完之后待打印的节省值,cutPrice,
            let re = 0;
            for(let i=0; i<arrBuy.length; i++){
                if(arrBuy[i].num >2){
                    //arrBuy[i].sumPrice -= arrBuy[i].price; //为什么这样减不掉总价？？
                    arrBuy[i].num -=1;
                    arrBuy[i].sumPrice = arrBuy[i].price * arrBuy[i].num;
                    re += arrBuy[i].price;
                    arrBuy[i].num +=1;
                }
                cutPrice = re;
                sum +=  arrBuy[i].sumPrice;
            }

            //打印
            let strAll =
                '***<没钱赚商店>购物清单***\n'+
                printBuy(arrBuy)+'\n'+
                '----------------------\n'+
                '挥泪赠送商品：\n'+
                freePrint(loadPromotions())+'\n'+
                '----------------------\n' +
                '总计：'+ sum.toFixed(2) +'(元)\n' +
                '节省：'+ cutPrice.toFixed(2)+ '(元)\n' +
                '**********************';
            //console.log(strAll);
            return strAll;
        }

//printInventory(inputs);
//打印免费赠送的商品
    function freePrint() {
        let arrTemp = loadPromotions()[0].barcodes;
        for (var i = 0; i < arrTemp.length; i++) {
            objFree = loadAllItems().filter(function (temp) {
                return (temp.barcode === arrTemp[i].slice(0,10))
            });
            arrFree.push({
                name: objFree[0].name,
                num: 1,
                unit: objFree[0].unit,
            });
        }
        //console.log(JSON.stringify(arrFree));//对象名加了引号
        let result = arrFree.map(function (temp) {
            let strFree = '名称：'+ temp.name +"，数量："+ temp.num + temp.unit;
            //console.log(strFree+'\n');
            return strFree;
        });
        return result.join('\n');
    }
//freePrint();


//打印购买的商品
    function printBuy(arrBuy) {
        let result = arrBuy.map(function (temp) {
            let strBuy = '名称：'+ temp.name +'，数量：'+ temp.num + temp.unit +
                '，单价：' + temp.price.toFixed(2) + '(元)，小计：'+ temp.sumPrice.toFixed(2)+'(元)';
            //console.log(strBuy+'\n');
            return strBuy;
        });
        return result.join('\n');
    }

module.exports = main;

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [

                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}


function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}
