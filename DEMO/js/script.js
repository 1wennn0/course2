
var bookDataFromLocalStorage = [];

$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:"image/database.jpg"},
        {text:"網際網路",value:"image/internet.jpg"},
        {text:"應用系統整合",value:"image/system.jpg"},
        {text:"家庭保健",value:"image/home.jpg"},
        {text:"語言",value:"image/language.jpg"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    function onChange(){
        $(".book-image").attr("src",this.value())
    }

    $("#bought_datepicker").kendoDatePicker({
            format:"yyyy-MM-dd"
        }
    );
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
            model: {
            fields: {
                    BookId: {type:"int"},
                    BookName: { type: "string" },
                    BookCategory: { type: "string" },
                    BookAuthor: { type: "string" },
                    BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: function(e){
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.target).closest("tr"));
                    var dataSource = $("#book_grid").data("kendoGrid").dataSource;//取得grid資料
                    dataSource.remove(dataItem);//remove from datasource
                    stringJson = JSON.stringify(dataSource.data())//將陣列修改成JSON字串
                    localStorage.setItem("bookData", stringJson);//將處理後的JSON字串更新到資料庫中
                    
                }
              }, title: " ", width: "120px" 
            } 
        ]
    });
    $("#window").kendoWindow({
        width: "600px",
        title: "新增書籍",
        visible: false,
        actions: [
            "Pin","Minimize","Maximize","Close" 
        ],
        close: onClose
    });
    $(".book-grid-search").on("input",search);  //和search這個function做綁定
})
function search()
{
    var value=this.value;
    var filter = { field: "BookName", operator: "contains", value: value };
    $("#book_grid").data("kendoGrid").dataSource.filter(filter);
}
function addItem()
{
   //alert("新增成功");
   //e.preventDefault();
   var newrecord=$("#book_grid").data("kendoGrid").dataSource.data();//更新資料庫
   var id=newrecord[newrecord.length-1].BookId//要取得最後一個ID裡的bookid
   var bookid=parseInt(id)+1;
   inputObject = {"BookId":bookid,
                  "BookName":$("#book_name").val(),
                  "BookCategory":$("#book_category").data("kendoDropDownList").text(),
                  "BookAuthor":$("#book_author").val(),
                  "BookBoughtDate":$("#bought_datepicker").val(), done: false };//建立一個符合我們需求的物件資料
$("#book_grid").data("kendoGrid").dataSource.add(inputObject);//將新物件加入我們的陣列,從最後一項塞入
   var data=$("#book_grid").data("kendoGrid").dataSource.data();
   stringJson = JSON.stringify(data);//將陣列修改成JSON字串
   localStorage.setItem("bookData", stringJson); //將處理後的JSON字串更新到資料庫中
   console.log(stringJson);
}

function showwindow(){
    $("#window").data("kendoWindow").center().open();
    $("#btu").fadeOut();
};
function onClose() {
    $("#btu").fadeIn();
}

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
    console.log(bookDataFromLocalStorage);
}
