import {create} from "zustand";

type searchModalStore={
    isOpen:boolean;
    onOpen:()=>void;
    onClose:()=>void;
   

}

const useSearchModal=create<searchModalStore>
((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false}),
    

}))

export default useSearchModal;