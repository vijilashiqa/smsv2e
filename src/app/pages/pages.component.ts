import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
// import { MENU_ITEMS } from './pages-menu';
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout >
      <nb-menu autoCollapse [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  role = [];
  constructor() {
    this.role = JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['menurole']);
    console.log('role item', this.role)
    // console.log('headend id',JSON.parse(localStorage.getItem('userinfo'))['hdid'])
    // JSON.parse(JSON.parse(localStorage.getItem('userinfo'))['menurole'])
    this.menu = [
      {
        title: 'Dashboard',
        icon: 'pie-chart',
        link: '/pages/iot-dashboard',
      },
      // {
      //   title: 'DAS Operations',
      // //  hidden: !(this.role.find(x => x == 101) || this.role.find(x => x == 102)),
      //   icon: 'settings-2',
      //   children: [
      //     {
      //       title: 'Global FingurePrint',
      //       link: '/pages/dasoperation/globlefingureprint',
      //     },
      //     {
      //       title: 'Global STB Messages',
      //       link: '/pages/dasoperation/globle-stbmessages',
      //     },
      //     {
      //       title: 'Kill OSD',
      //       link: '/pages/dasoperation/kill-osd',
      //     }

      //   ],

      // },
      {
        title: 'DAS Admin',
        icon:  'shield',
        children: [
          // {
          //   title: 'Admin User',
          //   // link: '/pages/das-administration/das-administration',
          //   children: [
          //     {
          //       title: 'List user',
          //       link: '/pages/das-administration/list-user',

          //     },
          //     {
          //       title: 'Create user',
          //     //  hidden: !this.role.find(x => x == 2012),
          //       link: '/pages/das-administration/create-user',
          //     }
          //   ]
          // },
          {
            title: 'User Profile',
            hidden: !(this.role.find(x => x == 2021) || this.role.find(x => x == 2022)),
            children: [
              {
                title: 'List User Profile',
                link: '/pages/das-administration/listuser-profile',
                hidden: !this.role.find(x => x == 2021),
              } ,

              {
                title: 'Add Profile',
                link: '/pages/das-administration/create-profile',
                hidden: !this.role.find(x => x == 2022),

              }
            ]
          },

          {
            title: 'ADD MSO',
            hidden: !(this.role.find(x => x == 9021) || this.role.find(x => x == 9022) || this.role.find(x => x == 9023)),
            children: [
              {
                title: 'Add MSO',
                link: '/pages/das-administration/addmso',

              },

              {
                title: 'List MSO',
                link: '/pages/das-administration/listmso',

              }
            ]
          },

          

          // {
          //   title: 'Operator Setting',
          //   // link: '/pages/das-administration/das-administration',
          //   children: [
          //     {
          //       title: 'Operator Setting List',
          //       link: '/pages/das-administration/operator-setting-list',

          //     },
          //     {
          //       title: 'Add Operator Setting',
          //       link: '/pages/das-administration/addoperator-setting',

          //     }


          //   ]
          // },
          {
            title: 'CAS Management',
            hidden: !(this.role.find(x => x == 2041) || this.role.find(x => x == 2042) || this.role.find(x => x == 2043)),
            // link: '/pages/das-administration/das-administration',
            children: [
              {
                title: 'CAS',
                link: '/pages/das-administration/caslist',
                hidden: !this.role.find(x => x == 2041),


              },
              {
                title: 'List HD CAS ',
                link: '/pages/das-administration/hdcaslist',
                hidden: !this.role.find(x => x == 2042),

              },
              {
                title: 'Add HD CAS',
                link: '/pages/das-administration/addhdcas',
                hidden: !this.role.find(x => x == 2043),

              }


            ]
          },
          {
            title: 'Headend',
            hidden: !(this.role.find(x => x == 2051) || this.role.find(x => x == 2052) || this.role.find(x => x == 2053)),
            // link: '/pages/das-administration/das-administration',
            children: [
              {
                title: 'List Headend',
                link: '/pages/das-administration/headendlist',
                hidden: !(this.role.find(x => x == 2051) || this.role.find(x => x == 2053)),

              },
              {
                title: 'Add Headend',
                link: '/pages/das-administration/headendadd',
                hidden: !this.role.find(x => x == 2052),

              }


            ]
          },
          {
            
            hidden: !(this.role.find(x => x == 20011) || this.role.find(x => x == 20021) || this.role.find(x => x == 20031) ||
            this.role.find(x => x == 20061) || this.role.find(x => x == 20051) || this.role.find(x => x == 20041) ||
            this.role.find(x => x == 20071) || this.role.find(x => x == 20081)
          ),
            title: 'Geo Panel',
            // link: '/pages/das-administration/das-administration',
            
            children: [
              {
                title: 'Country',
                link: '/pages/das-administration/geo-countylist',
                hidden: !this.role.find(x => x == 20031),

              },
              {
                title: 'State',
                link: '/pages/das-administration/geo-statelist',
                hidden: !this.role.find(x => x == 20041),

              },
              {
                title: 'District',
                link: '/pages/das-administration/geo-districtlist',
                hidden: !this.role.find(x => x == 20051),

              },
              {
                title: 'City',
                link: '/pages/das-administration/geo-citylist',
                hidden: !this.role.find(x => x == 20061),

              },
            
              {
                title: 'Area',
                link: '/pages/das-administration/geo-arealist',
                hidden: !this.role.find(x => x == 20071),

              },

              {
                title: 'Pincode',
                link: '/pages/das-administration/geo-pincodelist',
                hidden: !this.role.find(x => x == 20081),

              },
            ]
          },
          // {
          //   title: 'Revenue share',
          //   link: '/pages/das-administration/msorevenueshare',
          // },
          // {
          //   title: 'Manage SMS Credits',
          //   // link: '/pages/das-administration/das-administration',
          //   children: [
          //     {
          //       title: 'List SMS Credits',
          //       link: '/pages/das-administration/sms-creditslist',

          //     },
          //     {
          //       title: 'Add SMS Credits',
          //       link: '/pages/das-administration/sms-addcredits',

          //     },
          //     {
          //       title: 'SMS Gateway List',
          //       link: '/pages/das-administration/sms-gatelist',

          //     },
          //     {
          //       title: 'SMS Gateway',
          //       link: '/pages/das-administration/sms-gate',

          //     }
          //   ]
          // },

        ],
      },
      {
        hidden: !(this.role.find(x => x == 301) || this.role.find(x => x == 302)),

        title: 'Operator',
        icon: 'people',
        children: [
          {
            title: 'List Operator',
            link: '/pages/users/userlist',
            hidden: !this.role.find(x => x == 301),

          },
          {
            title: 'Add Operator',
            link: '/pages/users/add-user',
            hidden: !this.role.find(x => x == 302),

          },

        ]

      },
      {
        hidden: !(this.role.find(x => x == 401) || this.role.find(x => x == 402) || this.role.find(x => x == 404)),
        title: 'Subscriber',
        icon: 'person-add',
        children: [
          {
            hidden: !this.role.find(x => x == 401),
            title: 'List Subscriber',
            link: '/pages/customer/cust-list',
          },
          {
            title: 'Add Subscriber',
            hidden: !this.role.find(x => x == 402),
            link: '/pages/customer/add-cust',
          },
          {
            title: 'Surrender',
            link: '/pages/customer/surrender',
            hidden: !this.role.find(x => x == 406),

          },
          // {
          //   title: 'Surrenderd Subscribers',
          //   link: '/pages/customer/surender-stb',
          // },
        ]
      },
      {
        title: 'Channel',
        hidden: !(this.role.find(x => x == 5031) || this.role.find(x => x == 5032) || this.role.find(x => x == 5034) || this.role.find(x => x == 50021) ||
				this.role.find(x => x == 50011) || this.role.find(x => x == 50031) || this.role.find(x => x == 50032) ||
				this.role.find(x => x == 50034) || this.role.find(x => x == 50035) || this.role.find(x => x == 5021) ||
				this.role.find(x => x == 5022) || this.role.find(x => x == 5035)),
        icon: 'tv',
        children: [
          {
            title: 'Channel Managment',
            // link: '/pages/customer/cust-list',
            hidden: !(this.role.find(x => x == 50021) || this.role.find(x => x == 50011) || this.role.find(x => x == 50031) ||
            this.role.find(x => x == 50032) || this.role.find(x => x == 50034) || this.role.find(x => x == 50035)),
            children: [
              {
                title: 'List Languge',
                link: '/pages/channelcategory/listlanguage',
                hidden: !this.role.find(x => x == 50011),

              },
              {
                title: 'List Genre',
                link: '/pages/channelcategory/listgenre',
                hidden: !this.role.find(x => x == 50021),

              },
              {
                title: 'List Channel',
                link: '/pages/channelcategory/listchannel',
                hidden: !this.role.find(x => x == 50031),

              },
              {
                title: 'Create Channel',
                link: '/pages/channelcategory/addchannels',
                hidden: !this.role.find(x => x == 50032),

              },
              {
                title: 'List Channel Service',
                link: '/pages/channelcategory/listchannelsrv',
                hidden: !this.role.find(x => x == 50034),

              },
              {
                title: 'Create Channel Service',
                link: '/pages/channelcategory/addchannelsrv',
                hidden: !this.role.find(x => x == 50035),
              },
            ],

          },
          {
            hidden: !(this.role.find(x => x == 5021) || this.role.find(x => x == 5022)),
            title: 'Broadcaster',
            // link: '/pages/customer/cust-list',
            children: [
              {
                title: 'List Broadcaster',
                link: '/pages/channelcategory/broadcaster-list',
                hidden: !this.role.find(x => x == 5021),


              },
              {
                title: 'Add Broadcaster',
                link: '/pages/channelcategory/addbroadcaster',
                hidden: !this.role.find(x => x == 5022),

              },

            ],

          },
          {
            title: 'Pacakge Managment',
            hidden: !(this.role.find(x => x == 5031) || this.role.find(x => x == 5032) || this.role.find(x => x == 5034) || this.role.find(x => x == 5035)),
            children: [
              {
                title: 'List Package',
                link: '/pages/channelcategory/packagelist',
                hidden: !this.role.find(x => x == 5031),

              },
              {
                title: 'Add Package',
                link: '/pages/channelcategory/addpackage',
                hidden: !this.role.find(x => x == 5032),

              },
              {
                title: 'Price Assign',
                link: '/pages/channelcategory/searchpackage',
                hidden: !this.role.find(x => x == 5034),
              },
              // {
              //   title: 'Add Package Share',
              //   link: '/pages/channelcategory/addpackageshare',

              // },
              // {
              //   title: 'List Package Share',
              //   link: '/pages/channelcategory/packagesharelist',

              // },
              // {
              //   title: 'List Package Product',
              //   link: '/pages/channelcategory/listpackprod',

              // },
            ],
          },
        ],
      },
      {
        title: 'Inventory',
        hidden: !(this.role.find(x => x == 6011) || this.role.find(x => x == 6021) || this.role.find(x => x == 6031) ||
				this.role.find(x => x == 6041) || this.role.find(x => x == 6044) || this.role.find(x => x == 6045) ||
				this.role.find(x => x == 6051) || this.role.find(x => x == 6061) || this.role.find(x => x == 6062) ||
				this.role.find(x => x == 608)
			),
        icon: 'file-text',
        children: [
          {
            title: 'Vendor',
            link: '/pages/inventory/vendorlist',
            hidden: !this.role.find(x => x == 6011),
          },
          {
            title: 'STB Types',
            link: '/pages/inventory/stblist',
            hidden: !this.role.find(x => x == 6021),
          },
          {
            title: 'Model',
            link: '/pages/inventory/modellist',
            hidden: !this.role.find(x => x == 6031),

          },
          {
            title: 'Vendor Details',
            // link: '/pages/layout/stepper',
            hidden: !(this.role.find(x => x == 6041) || this.role.find(x => x == 6042) || this.role.find(x => x == 6043)),

            children: [
              {
                title: 'List Vendor Details',
                link: '/pages/inventory/Vendordetailslist',
                hidden: !this.role.find(x => x == 6041),

              },
              {
                title: 'Add Vendor Detail',
                link: '/pages/inventory/addvendordetails',
                hidden: !this.role.find(x => x == 6042),
              },
              // {
              //   title: 'List Business Detail',
              //   link: '/pages/inventory/businesslistdetails',
              // },
            ],
          },
          {
            title: 'HSN/SAC',
            link: '/pages/inventory/hsnlist',
            hidden: !this.role.find(x => x == 6051),
          },
          {
            title: 'List Stock Inward',
            link: '/pages/inventory/liststock',
            hidden: !this.role.find(x => x == 6061),
          },
          {
            title: 'Add Stock Inward',
            link: '/pages/inventory/addstock',
            hidden: !this.role.find(x => x == 6062),
          },
          // {
          //   title: 'List Fault STB',
          //   link: '/pages/inventory/faultstb',
          // },

        ],
      },
      {
        title: 'STB Management',
        hidden: !(this.role.find(x => x == 701) || this.role.find(x => x == 702) || this.role.find(x => x == 704) ||
				this.role.find(x => x == 705) || this.role.find(x => x == 707) || this.role.find(x => x == 712) ||
				this.role.find(x => x == 708) || this.role.find(x => x == 709) || this.role.find(x => x == 710) ||
				this.role.find(x => x == 711) || this.role.find(x => x == 715) || this.role.find(x => x == 716)
				|| this.role.find(x => x == 717)
			),
        icon: 'hard-drive',
        children: [
          {
            title: 'List STB',
            link: '/pages/stbmanagement/stblist',
            hidden: !this.role.find(x => x == 701),
          },
          {
            title: 'Upload STB',
            link: '/pages/stbmanagement/addstb',
            hidden: !this.role.find(x => x == 702),
          },
          // {
          //   title: 'List Card',
          //   link: '/pages/stbmanagement/cardlist',
          // },
          // {
          //   title: 'Upload Card',
          //   link: '/pages/stbmanagement/uploadcard',
          // },
        //  {
          //   title: 'STB Cust Mapping ',
          //   link: '/pages/stbmanagement/custmapping',
          // },
          // {
          //   title: 'Bulk Vc Activation',
          //   link: '/pages/stbmanagement/bulkvcactive',
          // },
          // {
          //   title: 'Bulk Paring',
          //   link: '/pages/stbmanagement/bulkpairing',
          // },
          // {
          //   title: 'STB Terminal Upload',
          //   link: '/pages/stbmanagement/stbterminal',
          // },
          // {
          //   title: 'Bulk Acivation/Deactivation',
          //   link: '/pages/stbmanagement/bulkactivation',
          // },
          // {
          //   title: 'Bulk Service Extention',
          //   link: '/pages/stbmanagement/bulkserviceactivation',
          // },
          // {
          //   title: 'List Fault STB',
          //   link: '/pages/stbmanagement/faultstb',
          // },

          // {
          //   title: 'STB Active/Deactive Logs',
          //   link: '/pages/stbmanagement/stbactdeact',
          // },
        ],

      },
      {
        title: 'Accounts',
        hidden: !(this.role.find(x => x == 801) || this.role.find(x => x == 802) || this.role.find(x => x == 804) || this.role.find(x => x == 809)),

        icon: 'monitor',
        children: [
          {
            title: 'List Deposit',
            link: '/pages/accounts/depositlist',
            hidden: !this.role.find(x => x == 801),
          },
          {
            title: 'Add Deposit',
            link: '/pages/accounts/adddeposit',
            hidden: !this.role.find(x => x == 802),
          },
          // {
          //   title: 'List Invoice',
          //   link: '/pages/accounts/invoicelist',
          // },
          // {
          //   title: 'Wallet Share',
          //   link: '/pages/accounts/walletshare',
          // },
          // {
          //   title: 'Wallet List',
          //   link: '/pages/accounts/walletlist',
          // },
          // {
          //   title: 'Deposit Pivot List',
          //   link: '/pages/accounts/pivotlist',
          // },

        ],
      },



      // {
      //   title: 'FEATURES',
      //   group: true,
      // },
      // {
      //   title: 'Layout',
      //   icon: 'layout',
      //   children: [
      //     {
      //       title: 'Stepper',
      //       link: '/pages/layout/stepper',
      //     },
      //     {
      //       title: 'List',
      //       link: '/pages/layout/list',
      //     },
      //     {
      //       title: 'Infinite List',
      //       link: '/pages/layout/infinite-list',
      //     },
      //     {
      //       title: 'Accordion',
      //       link: '/pages/layout/accordion',
      //     },
      //     {
      //       title: 'Tabs',
      //       pathMatch: 'prefix',
      //       link: '/pages/layout/tabs',
      //     },
      //   ],
      // },
      // {
      //   title: 'Forms',
      //   icon: 'edit-2',
      //   children: [
      //     {
      //       title: 'Form Inputs',
      //       link: '/pages/forms/inputs',
      //     },
      //     {
      //       title: 'Form Layouts',
      //       link: '/pages/forms/layouts',
      //     },
      //     {
      //       title: 'Buttons',
      //       link: '/pages/forms/buttons',
      //     },
      //     {
      //       title: 'Datepicker',
      //       link: '/pages/forms/datepicker',
      //     },
      //   ],
      // },
      // {
      //   title: 'UI Features',
      //   icon: 'keypad',
      //   link: '/pages/ui-features',
      //   children: [
      //     {
      //       title: 'Grid',
      //       link: '/pages/ui-features/grid',
      //     },
      //     {
      //       title: 'Icons',
      //       link: '/pages/ui-features/icons',
      //     },
      //     {
      //       title: 'Typography',
      //       link: '/pages/ui-features/typography',
      //     },
      //     {
      //       title: 'Animated Searches',
      //       link: '/pages/ui-features/search-fields',
      //     },
      //   ],
      // },
      // {
      //   title: 'Modal & Overlays',
      //   icon: 'browser',
      //   children: [
      //     {
      //       title: 'Dialog',
      //       link: '/pages/modal-overlays/dialog',
      //     },
      //     {
      //       title: 'Window',
      //       link: '/pages/modal-overlays/window',
      //     },
      //     {
      //       title: 'Popover',
      //       link: '/pages/modal-overlays/popover',
      //     },
      //     {
      //       title: 'Toastr',
      //       link: '/pages/modal-overlays/toastr',
      //     },
      //     {
      //       title: 'Tooltip',
      //       link: '/pages/modal-overlays/tooltip',
      //     },
      //   ],
      // },
      // {
      //   title: 'Extra Components',
      //   icon: 'message-circle',
      //   children: [
      //     {
      //       title: 'Calendar',
      //       link: '/pages/extra-components/calendar',
      //     },
      //     {
      //       title: 'Progress Bar',
      //       link: '/pages/extra-components/progress-bar',
      //     },
      //     {
      //       title: 'Spinner',
      //       link: '/pages/extra-components/spinner',
      //     },
      //     {
      //       title: 'Alert',
      //       link: '/pages/extra-components/alert',
      //     },
      //     {
      //       title: 'Calendar Kit',
      //       link: '/pages/extra-components/calendar-kit',
      //     },
      //     {
      //       title: 'Chat',
      //       link: '/pages/extra-components/chat',
      //     },
      //   ],
      // },
      // {
      //   title: 'Maps',
      //   icon: 'map',
      //   children: [
      //     {
      //       title: 'Google Maps',
      //       link: '/pages/maps/gmaps',
      //     },
      //     {
      //       title: 'Leaflet Maps',
      //       link: '/pages/maps/leaflet',
      //     },
      //     {
      //       title: 'Bubble Maps',
      //       link: '/pages/maps/bubble',
      //     },
      //     {
      //       title: 'Search Maps',
      //       link: '/pages/maps/searchmap',
      //     },
      //   ],
      // },
      // {
      //   title: 'Charts',
      //   icon: 'pie-chart',
      //   children: [
      //     {
      //       title: 'Echarts',
      //       link: '/pages/charts/echarts',
      //     },
      //     {
      //       title: 'Charts.js',
      //       link: '/pages/charts/chartjs',

      //     },
      //     {
      //       title: 'D3',
      //       link: '/pages/charts/d3',
      //     },
      //   ],
      // },
      // {
      //   title: 'Editors',
      //   icon: 'text',
      //   children: [
      //     {
      //       title: 'TinyMCE',
      //       link: '/pages/editors/tinymce',
      //     },
      //     {
      //       title: 'CKEditor',
      //       link: '/pages/editors/ckeditor',
      //     },


      //   ],
      // },
      // {
      //   title: 'Tables & Data',
      //   icon: 'grid',
      //   children: [
      //     {
      //       title: 'Smart Table',
      //       link: '/pages/tables/smart-table',
      //     },
      //     {
      //       title: 'Tree Grid',
      //       link: '/pages/tables/tree-grid',
      //     },
      //   ],
      // },
      // {
      //   title: 'Miscellaneous',
      //   icon: 'shuffle-2',
      //   children: [
      //     {
      //       title: '404',
      //       link: '/pages/miscellaneous/404',
      //     },
      //   ],
      // },


      // {
      //   title: 'login',
      //   icon: 'shuffle-2',
      //   children: [
      //     {
      //       title: 'login',
      //       link: '/pages/login/loginc'
      //     },
      //   ]
      // },
      // {
      //   title: 'Auth',
      //   icon: 'lock',
      //   children: [
      //     {
      //       title: 'Login',
      //       link: '/auth/login',
      //     },
      //     {
      //       title: 'Register',
      //       link: '/auth/register',
      //     },
      //     {
      //       title: 'Request Password',
      //       link: '/auth/request-password',
      //     },
      //     {
      //       title: 'Reset Password',
      //       link: '/auth/reset-password',
      //     },
      //   ],
      // },

    ];

  }

  menu: NbMenuItem[];
}