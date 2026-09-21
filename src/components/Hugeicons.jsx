import React from 'react';

// Exact official Hugeicons vector definitions (self-contained to prevent Netlify/Linux ESM barrel import bugs)
const ICONS = {
  "File02Icon": [
    [
      "path",
      {
        "d": "M8 17H16",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M8 13H12",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ]
  ],
  "Settings02Icon": [
    [
      "path",
      {
        "d": "M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z",
        "stroke": "currentColor",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "Building03Icon": [
    [
      "path",
      {
        "d": "M16 10L18.1494 10.6448C19.5226 11.0568 20.2092 11.2628 20.6046 11.7942C21 12.3256 21 13.0425 21 14.4761V22",
        "stroke": "currentColor",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M8 9L11 9M8 13L11 13",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M12 22V19C12 18.0572 12 17.5858 11.7071 17.2929C11.4142 17 10.9428 17 10 17H9C8.05719 17 7.58579 17 7.29289 17.2929C7 17.5858 7 18.0572 7 19V22",
        "stroke": "currentColor",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ],
    [
      "path",
      {
        "d": "M2 22L22 22",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "3"
      }
    ],
    [
      "path",
      {
        "d": "M3 22V6.71724C3 4.20649 3 2.95111 3.79118 2.32824C4.58237 1.70537 5.74742 2.04355 8.07752 2.7199L13.0775 4.17122C14.4836 4.57937 15.1867 4.78344 15.5933 5.33965C16 5.89587 16 6.65344 16 8.16857V22",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "4"
      }
    ]
  ],
  "UserIcon": [
    [
      "path",
      {
        "d": "M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "circle",
      {
        "cx": "12",
        "cy": "6.99988",
        "r": "4",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "Calendar03Icon": [
    [
      "path",
      {
        "d": "M16 2V6M8 2V6",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M3 10H21",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ],
    [
      "path",
      {
        "d": "M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "3"
      }
    ]
  ],
  "Download04Icon": [
    [
      "path",
      {
        "d": "M16.9504 12.1817C17.1981 12.814 16.5076 13.5726 15.1267 15.0899C13.6702 16.6902 12.9201 17.4904 12 17.5C11.0799 17.4904 10.3298 16.6902 8.87331 15.0899C7.49239 13.5726 6.80193 12.814 7.04964 12.1817C7.05868 12.1586 7.06851 12.1359 7.0791 12.1135C7.34928 11.542 8.24477 11.5029 10 11.5002V4.99998C10 4.53501 10 4.30253 10.0511 4.11179C10.1898 3.59414 10.5941 3.1898 11.1118 3.05111C11.3025 3 11.535 3 12 3C12.4649 3 12.6974 3 12.8882 3.05111C13.4058 3.1898 13.8102 3.59414 13.9489 4.11179C14 4.30253 14 4.53501 14 4.99998V11.5002C15.7552 11.5029 16.6507 11.542 16.9209 12.1135C16.9315 12.1359 16.9413 12.1586 16.9504 12.1817Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M5.00006 21H19.0001",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "Sun03Icon": [
    [
      "path",
      {
        "d": "M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z",
        "stroke": "currentColor",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "Moon02Icon": [
    [
      "path",
      {
        "d": "M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ]
  ],
  "RotateLeft01Icon": [
    [
      "path",
      {
        "d": "M20.0071 14.5662L19.3587 14.1731C18.7986 13.8508 18.3579 13.3564 18.102 12.7634L15.68 7.15102C15.5927 6.94865 15.4729 6.77988 15.328 6.64097C14.6876 6.02689 13.5808 6.28697 13.0432 6.99226C12.0506 8.29448 13.3839 9.52751 13.1022 10.6133L5.35908 6.26089C3.55799 5.28913 2.0024 7.87074 3.79277 9.06333L8.37607 11.6124C7.4934 12.765 5.25512 18.3551 8.12341 20.0599C8.28646 20.1568 8.4672 20.2213 8.64852 20.2773C8.76516 20.3134 8.88186 20.3496 8.99761 20.3857C9.8979 20.6667 11.6003 21.02 12.7668 20.9182C13.9811 20.8123 14.7421 21.4597 15.68 21.9995",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M9.36184 4.96447C9.75873 5.36011 11.4854 5.24597 12.1223 5.16653M9.36184 4.96447C8.96494 4.56883 8.95358 2.63679 9.03328 2.0019M9.36184 4.96447C10.3829 3.19624 14.4425 0.375691 18.4708 3.19624C20.4175 4.55924 20.6922 5.4182 21 5.99362",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "Delete02Icon": [
    [
      "path",
      {
        "d": "M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M9.5 16.5L9.5 10.5",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ],
    [
      "path",
      {
        "d": "M14.5 16.5L14.5 10.5",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeWidth": "1.5",
        "key": "3"
      }
    ]
  ],
  "ViewIcon": [
    [
      "path",
      {
        "d": "M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z",
        "stroke": "currentColor",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z",
        "stroke": "currentColor",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "Upload04Icon": [
    [
      "path",
      {
        "d": "M5.25 21H18.75C18.9822 21 19.0983 21 19.196 20.9904C20.1456 20.8968 20.8968 20.1456 20.9904 19.196C21 19.0983 21 18.9822 21 18.75C21 18.5178 21 18.4017 20.9904 18.304C20.8968 17.3544 20.1456 16.6032 19.196 16.5096C19.0983 16.5 18.9822 16.5 18.75 16.5H17.0607C16.8324 16.5 16.7182 16.5 16.6087 16.5121C16.2317 16.5538 15.8742 16.7018 15.5781 16.939C15.4921 17.0079 15.4114 17.0886 15.25 17.25C15.0886 17.4114 15.0079 17.4921 14.9219 17.561C14.6258 17.7982 14.2683 17.9462 13.8913 17.9879C13.7818 18 13.6676 18 13.4393 18H10.5607C10.3324 18 10.2182 18 10.1087 17.9879C9.73165 17.9462 9.37423 17.7982 9.07814 17.561C8.99213 17.4921 8.91142 17.4114 8.75 17.25C8.58858 17.0886 8.50787 17.0079 8.42186 16.939C8.12577 16.7018 7.76835 16.5538 7.3913 16.5121C7.28177 16.5 7.16763 16.5 6.93934 16.5H5.25C5.01783 16.5 4.90175 16.5 4.80397 16.5096C3.85441 16.6032 3.10315 17.3544 3.00963 18.304C3 18.4017 3 18.5178 3 18.75C3 18.9822 3 19.0983 3.00963 19.196C3.10315 20.1456 3.85441 20.8968 4.80397 20.9904C4.90175 21 5.01783 21 5.25 21Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M16.5 7.49996C16.5 7.49996 13.1858 3.00001 12 3C10.8141 2.99999 7.5 7.5 7.5 7.5M12 4V15",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "CheckmarkCircle02Icon": [
    [
      "path",
      {
        "d": "M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z",
        "stroke": "currentColor",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M8 12.5L10.5 15L16 9",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "AlertCircleIcon": [
    [
      "circle",
      {
        "cx": "12",
        "cy": "12",
        "r": "10",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M12 8V12",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M12.125 15.75H12M12.25 15.75C12.25 15.8881 12.1381 16 12 16C11.8619 16 11.75 15.8881 11.75 15.75C11.75 15.6119 11.8619 15.5 12 15.5C12.1381 15.5 12.25 15.6119 12.25 15.75Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ]
  ],
  "ZoomInIcon": [
    [
      "path",
      {
        "d": "M17 17L21 21",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M7.5 11L14.5 11M11 7.5V14.5",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ]
  ],
  "ZoomOutIcon": [
    [
      "path",
      {
        "d": "M17 17L21 21",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ],
    [
      "path",
      {
        "d": "M7.5 11L14.5 11",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "2"
      }
    ]
  ],
  "ArrowLeft01Icon": [
    [
      "path",
      {
        "d": "M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ]
  ],
  "ArrowRight01Icon": [
    [
      "path",
      {
        "d": "M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ]
  ],
  "SignatureIcon": [
    [
      "path",
      {
        "d": "M22 12.6344C18 16.1465 17.4279 10.621 15.3496 11.0165C13 11.4637 11.5 16.4445 13 16.4445C14.5 16.4445 12.5 10.5 10.5 12.5556C8.5 14.6111 7.85936 17.2946 6.23526 15.3025C-1.5 5.81446 4.99998 -1.14994 8.16322 3.45685C10.1653 6.37256 6.5 16.9769 2 22",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M9 21H19",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "SparklesIcon": [
    [
      "path",
      {
        "d": "M15 2L15.5387 4.39157C15.9957 6.42015 17.5798 8.00431 19.6084 8.46127L22 9L19.6084 9.53873C17.5798 9.99569 15.9957 11.5798 15.5387 13.6084L15 16L14.4613 13.6084C14.0043 11.5798 12.4202 9.99569 10.3916 9.53873L8 9L10.3916 8.46127C12.4201 8.00431 14.0043 6.42015 14.4613 4.39158L15 2Z",
        "stroke": "currentColor",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ],
    [
      "path",
      {
        "d": "M7 12L7.38481 13.7083C7.71121 15.1572 8.84275 16.2888 10.2917 16.6152L12 17L10.2917 17.3848C8.84275 17.7112 7.71121 18.8427 7.38481 20.2917L7 22L6.61519 20.2917C6.28879 18.8427 5.15725 17.7112 3.70827 17.3848L2 17L3.70827 16.6152C5.15725 16.2888 6.28879 15.1573 6.61519 13.7083L7 12Z",
        "stroke": "currentColor",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "1"
      }
    ]
  ],
  "RefreshIcon": [
    [
      "path",
      {
        "d": "M20.0092 2V5.13219C20.0092 5.42605 19.6418 5.55908 19.4537 5.33333C17.6226 3.2875 14.9617 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ]
  ],
  "ChevronDown01Icon": [
    [
      "path",
      {
        "d": "M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9",
        "stroke": "currentColor",
        "strokeLinecap": "round",
        "strokeLinejoin": "round",
        "strokeWidth": "1.5",
        "key": "0"
      }
    ]
  ]
};

export const File02Icon = ICONS.File02Icon;
export const Settings02Icon = ICONS.Settings02Icon;
export const Building03Icon = ICONS.Building03Icon;
export const UserIcon = ICONS.UserIcon;
export const Calendar03Icon = ICONS.Calendar03Icon;
export const Download04Icon = ICONS.Download04Icon;
export const Sun03Icon = ICONS.Sun03Icon;
export const Moon02Icon = ICONS.Moon02Icon;
export const RotateLeft01Icon = ICONS.RotateLeft01Icon;
export const Delete02Icon = ICONS.Delete02Icon;
export const ViewIcon = ICONS.ViewIcon;
export const Upload04Icon = ICONS.Upload04Icon;
export const CheckmarkCircle02Icon = ICONS.CheckmarkCircle02Icon;
export const AlertCircleIcon = ICONS.AlertCircleIcon;
export const ZoomInIcon = ICONS.ZoomInIcon;
export const ZoomOutIcon = ICONS.ZoomOutIcon;
export const ArrowLeft01Icon = ICONS.ArrowLeft01Icon;
export const ArrowRight01Icon = ICONS.ArrowRight01Icon;
export const SignatureIcon = ICONS.SignatureIcon;
export const SparklesIcon = ICONS.SparklesIcon;
export const RefreshIcon = ICONS.RefreshIcon;
export const ChevronDown01Icon = ICONS.ChevronDown01Icon;

export function HugeiconsIcon({ icon, size = 20, color = 'currentColor', className = '', style = {}, ...props }) {
  if (!icon || !Array.isArray(icon)) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      {...props}
    >
      {icon.map(([tag, attrs], idx) => {
        if (tag === 'path') {
          return (
            <path
              key={attrs.key || idx}
              d={attrs.d}
              stroke={attrs.stroke === 'currentColor' ? color : attrs.stroke || color}
              strokeWidth={attrs.strokeWidth || '1.5'}
              strokeLinecap={attrs.strokeLinecap || 'round'}
              strokeLinejoin={attrs.strokeLinejoin || 'round'}
              fill={attrs.fill || 'none'}
            />
          );
        }
        if (tag === 'circle') {
          return (
            <circle
              key={attrs.key || idx}
              cx={attrs.cx}
              cy={attrs.cy}
              r={attrs.r}
              stroke={attrs.stroke === 'currentColor' ? color : attrs.stroke || color}
              strokeWidth={attrs.strokeWidth || '1.5'}
              fill={attrs.fill || 'none'}
            />
          );
        }
        return null;
      })}
    </svg>
  );
}
