import { createStore } from '../store/index'
const store = createStore();

export default (to, from, next) => {
  console.log(store.getters.user);
  if(store.getters.user){
    next()
  }else{
    next('/signin')
  }
}
