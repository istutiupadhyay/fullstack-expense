const token = localStorage.getItem('token');
function addNewExpense(e){
    e.preventDefault();
    const form = new FormData(e.target);

    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")

    }
    console.log(expenseDetails)
    axios.post('http://localhost:3000/user/addexpense',expenseDetails, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 201){
        addNewExpensetoUI(response.data.expense);
    } else {
        throw new Error('Failed To create new expense');
    }

    }).catch(err => showError(err))

}

window.addEventListener('DOMContentLoaded',()=>{
    const rows=localStorage.getItem('rows');
    const token= localStorage.getItem('token');
    const page=1;
    axios.get(`http://localhost:3000/user/getexpenses/?page=${page}&rows=${rows}`, {headers:{'Authorization':token}})
    .then(data=>{
        addNewExpensetoUI(data.data.data)
        showPagination(data.data)
    })
    .catch(err => {console.log(err)})
})

function addNewExpensetoUI(data){
    // const parentElement = document.getElementById('listOfExpenses');
    // const expenseElemId = `expense-${expense.id}`;
    // parentElement.innerHTML += `
    //     <li id=${expenseElemId}>
    //         ${expense.expenseamount} - ${expense.category} - ${expense.description}
    //         <button onclick='deleteExpense(event, ${expense.id})'>
    //             Delete Expense
    //         </button>
    //     </li>`
    const details=document.getElementById('listOfExpenses');
    details.innerHTML="";
    data.forEach(expense=>{
        const expenseHtml = `<li id=${expense.id}> ${expense.expenseamount}------ ${expense.description}------ ${expense.category} 
        <button onclick='deleteExpense(event, ${expense.id})'>
                    Delete Expense
        </button>        
        </li>`

        details.innerHTML +=expenseHtml;
    })
}


const pagination=document.getElementById('pagination');
function showPagination({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage
}){
    pagination.innerHTML="";

    if(hasPreviousPage){
        const btn2=document.createElement('button');
        btn2.innerHTML=previousPage;
        btn2.addEventListener('click',()=> getExpenses(previousPage));
        pagination.appendChild(btn2)
    }

    const btn1=document.createElement('button');
    btn1.innerHTML=currentPage;
    btn1.addEventListener('click',()=> getExpenses(currentPage));
    pagination.appendChild(btn1)

    if(hasNextPage){
        const btn3=document.createElement('button');
        btn3.innerHTML=nextPage;
        btn3.addEventListener('click',()=>getExpenses(nextPage));
        pagination.appendChild(btn3)
    }
}

function setRows(event){
    event.preventDefault()
    const rowsNumber=document.getElementById('rows-number').value;
    console.log(rowsNumber,'sasas')
    localStorage.setItem('rows',rowsNumber)
}


function getExpenses(page){
    const rows=localStorage.getItem('rows');
    const token= localStorage.getItem('token');
    axios.get(`http://localhost:3000/user/getexpenses/?page=${page}&rows=${rows}`,{headers:{'Authorization':token}})
    .then((data)=>{
        addNewExpensetoUI(data.data.data)
        showPagination(data.data)
    }).catch(err=>{
        console.log(err)
    })
}



function deleteExpense(e, expenseid) {
    axios.delete(`http://localhost:3000/user/deleteexpense/${expenseid}`, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 204){
            removeExpensefromUI(expenseid);
        } else {
            throw new Error('Failed to delete');
        }
    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}



document.getElementById('rzp-button1').onclick = async function (e) {
    e.preventDefault();
    const token=localStorage.getItem('token');
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "8107769692"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now')
            
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}


// For leaderBoard (premium feature)
window.addEventListener('DOMContentLoaded',()=>{
    const expenseDetails=document.getElementById('expense-details');
    const token = localStorage.getItem('token');
    const premiumTag= document.getElementById('premium-tag');
    const premiumBtn=document.getElementById('rzp-button1');
    axios.get('http://localhost:3000/purchase/premiumusers',{headers:{'Authorization':token}})
    .then(res=>{
        if(res.data.ispremiumuser==false){
            expenseDetails.remove()
        }
        if(res.data.ispremiumuser==true){
            premiumTag.innerHTML=('<h2>Premium User</h2>')
            premiumBtn.remove()
            axios.get('http://localhost:3000/user/getusers').then(res=>{
                const users=res.data.data;
                document.getElementById('leaderboard').innerHTML=`
                <h2>LEADERBOARD</h2>
                <ul id = "users"></ul>
                <table class="table">
                <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Total Expense</th>
                </tr>
                </thead> <tbody id = "output"></tbody> </table>`
                for(var i=0; i<users.length; i++){
                leaderBoardUsers(users[i])
            }
        })
        }


    }).catch(err => {
        console.log(err)
    })
})

// //to show users on leaderboard
// function leaderBoardUsers(user){
//     const leaderBoard=document.getElementById('leaderboard');  
//     const data=`
//     <li>${user.name}----${user.TotalCost}----<button onClick=showDetails(${user.id})>Show Details</button> </li>`
  
//     leaderBoard.innerHTML+=data;
    
//}

function leaderBoardUsers(user){
    try{
        document.getElementById('output').innerHTML += `
    <tr>
      <td>#</td>
      <td>${user.name}</td>
      <td>${user.TotalCost}</td></tr> `  
    }
    catch (err) {

        document.getElementById('error').innerHTML += "<h4>Something went wrong !</h4>";
        console.log(err);
    }  
}

function showDetails(id){
    axios.get(`http://localhost:3000/purchase/getdetails/${id}`)
    .then(res=>{
        console.log(res,'<<<<details')   
        const datas=res.data.data;
        if(datas.length==0){
            showNull()
        }else{
            for(var i=0; i<datas.length; i++){
                showDetailsOnScreen(datas[i])
            } 
        }         
    }).catch(err => console.log(err))
}

// To show others details (premium feature)
function showDetailsOnScreen(data){
    const details=document.getElementById('other-details');
    const datas=`<li>${data.amount}-----${data.description}-----${data.category} </li>`
    details.innerHTML +=datas;
}


function showNull(){
    const details=document.getElementById('other-details');
    details.innerHTML="No Expense Added";
}
