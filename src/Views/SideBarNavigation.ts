import NavigationTypes from "../Enums/NavigationTypes";
import UserRoles from "../Enums/UserRoles";
import INavigation from "../Intefaces/INavigation";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TimesOneMobiledataIcon from '@mui/icons-material/TimesOneMobiledata';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HandymanIcon from '@mui/icons-material/Handyman';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PeopleIcon from '@mui/icons-material/People';
import FeedIcon from '@mui/icons-material/Feed';
import ChatIcon from '@mui/icons-material/Chat';

const SideBarNavigation: INavigation[] = [
    {
        Name: "Dashboard",
        Icon: DashboardIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Orders",
        Icon: PlaylistAddCheckIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_order",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Repairs",
        Icon: HandymanIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_repair",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Devices",
        Icon: PhonelinkIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_device",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Services",
        Icon: HomeRepairServiceIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_service",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Feedbacks",
        Icon: FeedbackIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_feedback",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "FAQs",
        Icon: ReceiptLongIcon,
        roles: [UserRoles.ADMIN, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_faq",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Blogs",
        Icon: FeedIcon,
        roles: [UserRoles.ADMIN, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_blog",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Chat",
        Icon: ChatIcon,
        roles: [UserRoles.ADMIN, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/chat",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Users",
        Icon: PeopleIcon,
        roles: [UserRoles.ADMIN, UserRoles.RECEPTION],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_user",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Account",
        Icon: AccountBoxIcon,
        roles: [ UserRoles.ADMIN, UserRoles.RECEPTION, UserRoles.MAINTAINER],
        type: NavigationTypes.LINK,
        active: true,
        link: "/profile",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    // {
    //     Name: "Sign Out",
    //     Icon: LogoutIcon,
    //     roles: [UserRoles.COMPANY, UserRoles.CASHIER, UserRoles.ADMIN],
    //     type: NavigationTypes.ACTION,
    //     active: true,
    //     validator: async (user: any): Promise<boolean> => {
    //         return true;
    //     },
    //     action: async (user: any): Promise<void> => {

    //     }
    // },

];

export default SideBarNavigation;