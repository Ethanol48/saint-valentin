import {  DisClamed, GetClamed, GetItem, GetListOrder, GetNameItem, getUsername, GetWantToClaim, isUserAdmin, OrderSend, SetClamed } from '$lib/server/db/utilities';
import { date } from 'drizzle-orm/mysql-core';
import type { Actions, PageServerLoad } from './$types';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { List } from '$lib/components/ui/tabs';
import { LOGIN_REDIRECT } from '$lib/constants';


async function GetData(){
  
  const ListOrder =await GetListOrder();



  let list_result = [];

  async function GetListResult(userid : string,itemid : string,claimed: boolean | null) {
    return [await getUsername(userid), await GetNameItem(itemid),1,claimed]
  }

  /// Récuperer les users

  let list_userid : string[] = [];

  ListOrder.forEach(element => {
    if(!list_userid.includes(element.userid)){
      list_userid.push(element.userid)
    }
  });
  
  /// ajouter les users avec leur commande

  function UserInList(user_id : string, list ){ 
    let result = false;
    list.forEach(element => {
      if(element[0] === user_id){
        result = true;
        return;
      }
    });
    return result;
  }
  

  function AddItem( list,item : string){
    let result = false
    list.forEach(element => {
      if(item==element[0])
        {
        element[1]++
        result = true;
        return;
        }
    });
    if(!result){
      list.push([item,1])
    }
  }

  
  list_userid.forEach(el_UserId => {
    ListOrder.forEach(el_ListOrder => {
      
      if(el_UserId===el_ListOrder.userid){
        if(!(UserInList(el_ListOrder.userid, list_result))){
          list_result.push([el_ListOrder.userid, [[el_ListOrder.itemid , 1]]])
        }
        else{

          list_result.forEach(el_ListResult => {
            if(el_ListResult[0] === el_UserId){
              AddItem(el_ListResult[1], el_ListOrder.itemid);

              
            }
            
          });
          
            
          }
          
          
        }
      })
    });

  


  // remettre les noms de base
 

  async function GetNameItem_fct(item : string){
    return await GetNameItem(item)
  }

  async function GetNameUser_fct(Username : string){
    const a = await getUsername(Username)
    return a;
  }
  async function updateUserOrders(list_result) {
    for (let i = 0; i < list_result.length; i++) {      

      for (let j = 0; j < list_result[i][1].length; j++) {
        list_result[i][1][j][0] = await GetNameItem_fct(list_result[i][1][j][0]);
      }
      list_result[i].push( await GetClamed(list_result[i][0]))
      list_result[i].push(await GetWantToClaim(list_result[i][0]))
      list_result[i][0] = await GetNameUser_fct(list_result[i][0]);
    }
    
  }
  await updateUserOrders(list_result);

  return list_result;

}



export const load: PageServerLoad = async ({ locals }) => {  
	if (locals.user === null) {
		return redirect(302, LOGIN_REDIRECT);
	}

  const admin = await isUserAdmin(locals.user.id);
  
  if (!admin) {
    return redirect(302, '/home');
  }

  let ListResult = await GetData();

  
  console.log(ListResult[1])
  
  return {
    ListeOrder:ListResult
  };
};



export const actions: Actions = {
  hasClaimed: async ({ request }) => {
    
    console.log('calimed call')
    const formData = await request.formData();
    const user = formData.get('user');
    
    let userStr = "" + user;
    await SetClamed(userStr);

    
    let ListResult = await GetData()
    return { ListeOrder : ListResult}
    
  },

  DisClaimed: async ({ request }) => {
    console.log('diclaimed call')
    const formData = await request.formData();
    const user = formData.get('user');
    
    let userStr = "" + user;
    await DisClamed(userStr);

    
    let ListResult = await GetData()
    
    
    return { ListeOrder : ListResult}
  }
};

