import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

 const SideBarContext = createContext();

 export const SideBarProvider = ({ children }) => {
    const pathname = usePathname();
    const [activeMenu, setActiveMenu] = useState(pathname);
    

    // useEffect(()=> {
    //    console.log("active menu: ", activeMenu);
    // },[activeMenu]);

    const value = {
        activeMenu,
        setActiveMenu
    };

       return (
        <SideBarContext.Provider value={value}>
            {children}
        </SideBarContext.Provider>
    );
 }

 
 export const useSideBar = () => {
     const context = useContext(SideBarContext);
     if (context === undefined) {
         throw new Error("useSideBar must be used within a SideBarContext");
     }
     return context;
 }
 