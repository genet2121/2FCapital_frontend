import FieldTypes from "../Enums/FiedTypes";
import UserRoles from "../Enums/UserRoles";
import UserState from "../Enums/UserState";
import IField from "../Intefaces/IField";
import IForm from "../Intefaces/IForm";
import IPagination from "../Intefaces/IPagination";
import Utils from "../Models/Utils";
import LocalData from "../Intefaces/LocalData";
import AuthResult from "../Intefaces/AuthResult";
import MainAPI from "../APIs/MainAPI";
import OrderStatus from "../Enums/OrderStatus";
import Operators from "../Enums/Operators";
import { LocalDining } from "@mui/icons-material";
import Order from "../Models/OrderModel";
import { Authorized, normal } from "../APIs/api";

const localRoles = [
	{ value: UserRoles.ADMIN, label: "Admin" },
	{ value: UserRoles.RECEPTION, label: "Reception" },
	{ value: UserRoles.MAINTAINER, label: "Technician" },
	{ value: UserRoles.CUSTOMER, label: "Customer" }
];

const localUserState = [
	{ value: UserState.ACTIVE, label: "Active" },
	{ value: UserState.INACTIVE, label: "Inactive" }
];
const localPaymentStatus = [
	{ value: "paid", label: "Payment Done" },
	{ value: "not_paid", label: "Not Paid" }
];

const localOrderStates = [
	{ value: OrderStatus.Requested, label: "Requested" },
	{ value: OrderStatus.Approved, label: "Approved" },
	{ value: OrderStatus.Received, label: "Phone Received" },
	{ value: OrderStatus.Ongoing, label: "Work Ongoing" },
	{ value: OrderStatus.Finished, label: "Finished" },
	{ value: OrderStatus.Paid, label: "Paid" },
	{ value: OrderStatus.Taken, label: "Phone Taken" },
	{ value: OrderStatus.Cancelled, label: "Cancelled" }
];

const localRating = [
	{ value: "0", label: "0 - Worest" },
	{ value: "1", label: "1 - Bad" },
	{ value: "2", label: "2 - Not Bad" },
	{ value: "3", label: "3 - Neutral" },
	{ value: "4", label: "4 - Good" },
	{ value: "5", label: "5 - Perfect" }
];

const uploadImage = async (token: string, table: string, attachment: {file: any, name: string}): Promise<number> => {
	try {
		let response = await MainAPI.addAttachment(token, "device", 0, attachment);
		return parseInt(response.id);
	}catch(error){
		return 0;
	}
}

const mapMultiple = (fields: any, mappings: any[], data: any[]) => {

}

const mapSingle = (fields: IField[], mappings: any, data: any) => {

	let new_fields: IField[] = fields.map(fld => {

		let mpfunc = mappings[`${fld.id}`];
		if (mpfunc) {
			return {
				...fld,
				...(mpfunc(data))
			};
		} else { return fld }

	});

	return new_fields;
}

const mapValue = async (fields: IField[], token?: string, table?: string) => {

	let new_instance: any = {};

	// fields.forEach(async (single_field) => {
	let single_field;
	let charToCheck = /[<>;\/]/g;

	for(let i = 0; i < fields.length; i++) {
		single_field = fields[i];
		if(single_field.value == "" || single_field.value == null || ((single_field.type == FieldTypes.NUMBER || single_field.type == FieldTypes.REFERENCE) && (Number.isNaN(single_field.value)))) {
			if(single_field.required) {
				throw new Error(`The field ${single_field.label} is required!`);
			}
		} else {

			if(charToCheck.test(`${single_field.value}`)) {
				throw new Error(`field ${single_field.label} should not contain characters such as '<', '>', '/', ';'`);
			}

			if(single_field.type == FieldTypes.NUMBER || single_field.type == FieldTypes.REFERENCE) {
				new_instance[single_field.id] = Number.isInteger(single_field.value) ? parseInt(single_field.value) : parseFloat(single_field.value);
			} else if((single_field.type == FieldTypes.DATE || single_field.type == FieldTypes.DATETIME)) {
				new_instance[single_field.id] = new Date(single_field.value).toISOString();
			} else if(single_field.type == FieldTypes.IMAGE) {
				if(!Number.isInteger(single_field.value)) {
					new_instance[single_field.id] = await uploadImage(token ?? "user", table ?? "user", {
						file: single_field.value.files[0],
						name: "image from input"
					});
                }else {
                    new_instance[single_field.id] = single_field.value;
                }
			} else {
				new_instance[single_field.id] = single_field.value;
			}
		}
	};

	return new_instance;
}

const tables: IForm[] = [
	{
		title: "Device",
		id: "tbl_device",
		roles: [UserRoles.MAINTAINER, UserRoles.ADMIN, UserRoles.RECEPTION],
		actions: [
			{
				roles: [UserRoles.ADMIN, UserRoles.RECEPTION],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {
					let new_odd: any = await mapValue(fields, token, "device");
					await MainAPI.update(token, "device", new_odd);
				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					return loggedUser.Roles.includes(UserRoles.ADMIN);
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "device", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "name",
				label: "Device Name",
				type: FieldTypes.TEXT,
				description: "Device offical name",
				value: "",
				order: 10,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "model",
				label: "Device Model Name",
				type: FieldTypes.TEXT,
				description: "The size of numbers found out of the picked numbers",
				value: "",
				order: 20,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "brand",
				label: "Type of Device",
				type: FieldTypes.SELECT,
				description: "What type of device is it.",
				value: "",
				order: 30,
				required: true,
				visible: true,
				options: [
					{ value: "iphone", label: "I-Phone" },
					{ value: "android", label: "Android" },
					{ value: "other", label: "Others" },
				],
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "description",
				label: "Device Description",
				type: FieldTypes.TEXTAREA,
				description: "What type of device is it.",
				value: "",
				order: 30,
				required: true,
				visible: true,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "specification",
				label: "Device Specs",
				type: FieldTypes.TEXTAREA,
				description: "What type of device is it.",
				value: "",
				order: 30,
				required: true,
				visible: true,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "picture",
				label: "Picture",
				type: FieldTypes.IMAGE,
				description: "The Device Picture",
				value: "",
				order: 20,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			}
		],

		onsubmit: async (token: string, fields: IField[]): Promise<void> => {

			let new_instance = await mapValue(fields, token, "device");
			return await MainAPI.createNew(token, "device", new_instance);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {

			let data = {};
			if(parseInt(id) > 0){
				data = await MainAPI.getSingle(token, "device", id);
			}

			return mapSingle(all_fields, {
				"id": (data: any) => ({
					value: (parseInt(id) > 0) ? data.id : ""
				}),
				"name": (data: any) => ({
					value: (parseInt(id) > 0) ? data.name : ""
				}),
				"model": (data: any) => ({
					value: (parseInt(id) > 0) ? data.model : ""
				}),
				"brand": (data: any) => ({
					value: (parseInt(id) > 0) ? data.brand : ""
				}),
				"description": (data: any) => ({
					value: (parseInt(id) > 0) ? data.description : ""
				}),
				"specification": (data: any) => ({
					value: (parseInt(id) > 0) ? data.specification : ""
				}),
				"picture": (data: any) => ({
					value: (parseInt(id) > 0) ? data.picture : ""
				})
			}, data);

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			return await MainAPI.getAll(token, "device", pageNumber, pageSize, condition);

		}
	},
	{
		title: "Users",
		id: "tbl_user",
		roles: [UserRoles.ADMIN, UserRoles.RECEPTION],
		actions: [
			{
				roles: [UserRoles.ADMIN, UserRoles.RECEPTION],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {
					let new_user: any = {};

					fields.forEach(fld => {
						if (fld.id != "password") {
							new_user[fld.id] = fld.value;
						}
					});

					await MainAPI.update(token, "user", new_user);
				}
			},
			{
				roles: [UserRoles.ADMIN, UserRoles.RECEPTION],
				lable: "Reset Password",
				class: "btn-secondary shadow-sm",
				action: async (token: string, fields: IField[]) => {

					let phone_field = fields.find(fld => (fld.id == "phone"));

					if(!phone_field || phone_field.value == "") {
						throw new Error("phone not found or it is empty!");
					}

					await Authorized(token).bodyRequest("post", "auth/password_reset", {
						phone: `${phone_field.value}`
					});

				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "user", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [
			{
				id: "rl_assigned_order",
				form: "tbl_order",
				lable: "Assigned Orders",
				relatingColumn: "technician",
				loader: (fields: IField[]): any => {

					let field = fields.find(fld => (fld.id == "id"));
					return {
						"technician": {
							value: field ? field.value : "",
							operator: Operators.IS,
							type: FieldTypes.NUMBER
						}
					};

				}
			},
			{
				id: "rl_order",
				form: "tbl_order",
				lable: "Orders",
				relatingColumn: "user_id",
				loader: (fields: IField[]): any => {

					let field = fields.find(fld => (fld.id == "id"));
					return {
						"userId": {
							value: field ? field.value : "",
							operator: Operators.IS,
							type: FieldTypes.NUMBER
						}
					};

				}
			}
		],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "User Id",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "name",
				label: "Full Name",
				type: FieldTypes.TEXT,
				description: "User Full Name",
				value: "",
				order: 10,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "phone",
				label: "Phone Number",
				type: FieldTypes.TEXT,
				description: "Users Phone Number",
				value: "",
				order: 10,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "email",
				label: "Email Address",
				type: FieldTypes.EMAIL,
				description: "User Email Address",
				value: "",
				order: 20,
				required: false,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "role",
				label: "Role",
				type: FieldTypes.SELECT,
				description: "User Role",
				value: "",
				order: 30,
				required: true,
				visible: true,
				readonly: true,
				options: localRoles,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "password",
				label: "Password",
				type: FieldTypes.PASSWORD,
				description: "User Password",
				value: "",
				order: 20,
				required: false,
				visible: false,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			}

		],

		onsubmit: async (token: string, fields: IField[]): Promise<any> => {

			let new_instance = await mapValue(fields, token, "user");
			return await MainAPI.createNew(token, "user", new_instance);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {
			
			let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);

			if (parseInt(id) <= 0) {
				let mappings = {
					"id": (data: any) => ({
						value: ""
					}),
					"name": (data: any) => ({
						value: ""
					}),
					"phone": (data: any) => ({
						value: ""
					}),
					"email": (data: any) => ({
						value: ""
					}),
					"role": (data: any) => ({
						value: "",
						readonly: !is_admin,
						options: is_admin ? localRoles : [{ value: UserRoles.CUSTOMER, label: "Customer" }]
					}),
					"password": (data: any) => ({
						value: ""
					}),
				};

				return mapSingle(all_fields, mappings, {});
				// return all_fields.map(fld => {fld.value = ""; return fld;});
			}

			let data = await MainAPI.getSingle(token, "user", id);
			if (data) {
				let mappings = {
					"id": (data: any) => ({
						value: data.id
					}),
					"name": (data: any) => ({
						value: data.name
					}),
					"phone": (data: any) => ({
						value: data.phone
					}),
					"email": (data: any) => ({
						value: data.email
					}),
					"role": (data: any) => ({
						value: data.role,
						readonly: !is_admin,
						options: is_admin ? localRoles : [{ value: UserRoles.CUSTOMER, label: "Customer" }]
					}),
					"password": (data: any) => ({
						value: data.password
					}),
				};

				return mapSingle(all_fields, mappings, data);
			}

			return all_fields;

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			let data = await MainAPI.getAll(token, "user", pageNumber, pageSize, condition);

			let records = data.Items.map((rec) => ({
                ...rec,
                role: Utils.getFromArray("value", rec.role, "label", localRoles)
			}));

			data.Items = records;
			return data;

		}
	},
	{
		title: "Blogs",
		id: "tbl_blog",
		roles: [UserRoles.ADMIN, UserRoles.MAINTAINER, UserRoles.RECEPTION],
		actions: [
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {
					await MainAPI.update(token, "blog", await mapValue(fields, token, "blog"));
				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					return loggedUser.Roles.includes(UserRoles.ADMIN);
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "blog", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "Blog Id",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "title",
				label: "Blog Title",
				type: FieldTypes.TEXT,
				description: "Blog Describing Title",
				value: "",
				order: 1,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "body",
				label: "Content",
				type: FieldTypes.TEXTAREA,
				description: "The Blog Content",
				value: "",
				order: 10,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "author",
				label: "Created By",
				type: FieldTypes.TEXT,
				description: "The Blog Content",
				value: "",
				order: 10,
				required: false,
				visible: false,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "date",
				label: "Date",
				type: FieldTypes.DATE,
				description: "Blog Posted Date",
				value: "",
				order: 20,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "image",
				label: "Picture",
				type: FieldTypes.IMAGE,
				description: "Blog Image Attachement",
				value: "",
				order: 20,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			}

		],

		onsubmit: async (token: string, fields: IField[]): Promise<void> => {

			let new_instance = await mapValue(fields, token, "blog");
			new_instance.date = new Date().toISOString();
			return await MainAPI.createNew(token, "blog", new_instance);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {

			let data = {};
			if (parseInt(id) > 0) {
				data = await MainAPI.getSingle(token, "blog", id);
			}

			return mapSingle(all_fields, {
				"id": (data: any) => ({
					value: (parseInt(id) > 0) ? data.id : ""
				}),
				"title": (data: any) => ({
					value: (parseInt(id) > 0) ? data.title : ""
				}),
				"body": (data: any) => ({
					value: (parseInt(id) > 0) ? data.body : ""
				}),
				"image": (data: any) => ({
					value: (parseInt(id) > 0) ? data.image : ""
				}),
				"date": (data: any) => ({
					value: (parseInt(id) > 0) ? Utils.convertISOToDate(data.date) : ""
				})
			}, data);

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			let data = await MainAPI.getAll(token, "blog", pageNumber, pageSize, condition);
			let temp = data.Items.map(blg => ({
				...blg,
				body: blg.body.length > 30 ? `${blg.body.substring(0, 30)}....` : blg.body
			}));
			data.Items = temp;
			return data;

		}
	},
	{
		title: "Frequently Asked Questions",
		id: "tbl_faq",
		roles: [UserRoles.ADMIN, UserRoles.MAINTAINER, UserRoles.RECEPTION],
		actions: [
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {
					let new_instance = await mapValue(fields, token, "faq");
					await MainAPI.update(token, "faq", new_instance);
				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					return loggedUser.Roles.includes(UserRoles.ADMIN);
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "faq", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [
		],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "Blog Id",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "title",
				label: "Blog Title",
				type: FieldTypes.TEXT,
				description: "Blog Describing Title",
				value: "",
				order: 10,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "date",
				label: "Posted Date",
				type: FieldTypes.DATE,
				description: "When the answer is posted",
				value: "",
				order: 30,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "body",
				label: "Content",
				type: FieldTypes.TEXTAREA,
				description: "The Blog Content",
				value: "",
				order: 20,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			}

		],

		onsubmit: async (token: string, fields: IField[]): Promise<void> => {

			let new_instance = await mapValue(fields, token, "faq");
			await MainAPI.createNew(token, "faq", new_instance);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {
			if (parseInt(id) <= 0) {
				return all_fields;
			}

			let data = await MainAPI.getSingle(token, "faq", id);
			if (data) {
				let mappings = {
					"id": (data: any) => ({
						value: data.id
					}),
					"title": (data: any) => ({
						value: data.title
					}),
					"body": (data: any) => ({
						value: data.body
					}),
					"date": (data: any) => ({
						value: Utils.convertISOToDate(data.date)
					}),
				};

				return mapSingle(all_fields, mappings, data);

			}

			return all_fields;

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			let data = await MainAPI.getAll(token, "faq", pageNumber, pageSize, condition);
			// let temp_items = [];
			let temp_items = data.Items.map(dt => ({
				...dt,
				date: Utils.convertISOToDate(dt.date),
				body: dt.body.length > 150 ? `${dt.body.substring(0, 150)}....` : dt.body
			}));
			data.Items = temp_items;
			return data;

		}
	},
	{
		title: "Services",
		id: "tbl_service",
		roles: [UserRoles.ADMIN, UserRoles.MAINTAINER, UserRoles.RECEPTION],
		actions: [
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN, UserRoles.RECEPTION],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {
					await MainAPI.update(token, "service", await mapValue(fields, token, "service"));
				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					return loggedUser.Roles.includes(UserRoles.ADMIN);
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "service", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [
		],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "Service Id",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "title",
				label: "Title",
				type: FieldTypes.TEXT,
				description: "Service Describing Title Text",
				value: "",
				order: 10,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "price",
				label: "Engineers",
				type: FieldTypes.NUMBER,
				description: "Number of engineers to provide this service",
				value: "",
				order: 30,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "description",
				label: "Description",
				type: FieldTypes.TEXTAREA,
				description: "Text to describe the service",
				value: "",
				order: 20,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "picture",
				label: "Picture",
				type: FieldTypes.IMAGE,
				description: "Service Describing Picture",
				value: "",
				order: 20,
				required: true,
				visible: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
					// try {
					// 	let response = await MainAPI.addAttachment(token, "service", 0, {
					// 		file: value.files[0],
					// 		name: "device image"
					// 	});
					// 	return parseInt(response.id);
					// }catch(error){
					// 	return 0;
					// }
				}
			}
		],

		onsubmit: async (token: string, fields: IField[]): Promise<void> => {

			let new_instance = await mapValue(fields, token, "service");
			return await MainAPI.createNew(token, "service", new_instance);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {
			
			let data = {};
			if(parseInt(id) > 0){
				data = await MainAPI.getSingle(token, "service", id);
			}

			return mapSingle(all_fields, {
				"id": (data: any) => ({
					value: (parseInt(id) > 0) ? data.id : ""
				}),
				"title": (data: any) => ({
					value: (parseInt(id) > 0) ? data.title : ""
				}),
				"description": (data: any) => ({
					value: (parseInt(id) > 0) ? data.description : ""
				}),
				"price": (data: any) => ({
					value: (parseInt(id) > 0) ? parseFloat(data.price) : ""
				}),
				"picture": (data: any) => ({
					value: (parseInt(id) > 0) ? parseFloat(data.picture) : ""
				}),
			}, data);

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			let data = await MainAPI.getAll(token, "service", pageNumber, pageSize, condition);
			// let temp_items = [];
			let temp_items = data.Items.map(dt => ({ ...dt, date: Utils.convertISOToDate(dt.date) }));
			data.Items = temp_items;
			return data;

		}
	},
	{
		title: "Orders",
		id: "tbl_order",
		roles: [UserRoles.RECEPTION, UserRoles.ADMIN, UserRoles.MAINTAINER],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
            {
				id: "number",
				label: "Order Number",
				type: FieldTypes.TEXT,
				description: "System Auto Generated Order number",
				value: "",
				order: 80,
				required: false,
				visible: true,
				readonly: true,
				// options: data.Companies,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "deviceId",
				label: "Device",
				type: FieldTypes.REFERENCE,
				description: "Related Device",
				value: "",
				references: "tbl_device",
				order: 10,
				required: true,
				visible: true,
				readonly: false,
				options: [],
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "serviceId",
				label: "Service",
				type: FieldTypes.REFERENCE,
				description: "Ordered Service",
				value: "",
				references: "tbl_service",
				order: 10,
				required: true,
				visible: true,
				readonly: false,
				options: [],
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "price",
				label: "Price",
				type: FieldTypes.NUMBER,
				description: "Cost needed for the repair!",
				value: "",
				order: 20,
				required: false,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "imei",
				label: "IMEI Number",
				type: FieldTypes.TEXT,
				description: "IMEI Number of you device!",
				value: "",
				order: 30,
				required: false,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "userId",
				label: "Customer",
				type: FieldTypes.REFERENCE,
				description: "Customer requested the repir order",
				references: "tbl_user",
				value: "",
				order: 40,
				required: true,
				visible: true,
				readonly: false,
				options: [],
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "technician",
				label: "Technician",
				type: FieldTypes.REFERENCE,
				description: "Assigned technician",
				references: "tbl_user",
				value: "",
				order: 40,
				required: false,
				visible: true,
				readonly: false,
				options: [],
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "warrantyAmount",
				label: "Total Warranty",
				type: FieldTypes.NUMBER,
				description: "Total Warranty Limit in month",
				value: "",
				order: 110,
				required: false,
				visible: true,
				readonly: true,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "date",
				label: "Order Date",
				type: FieldTypes.DATE,
				description: "Repare order date",
				value: "",
				order: 70,
				required: false,
				visible: true,
				readonly: true,
				// options: data.Branches,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "rating",
				label: "Rating",
				type: FieldTypes.SELECT,
				description: "The last time the cashier submit collected money.",
				value: "",
				order: 90,
				required: false,
				visible: true,
				readonly: true,
				options: localRating,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "state",
				label: "Status",
				type: FieldTypes.SELECT,
				description: "Repair status.",
				value: "",
				order: 100,
				required: false,
				visible: true,
				readonly: true,
				options: localOrderStates,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "is_paid",
				label: "Payment",
				type: FieldTypes.SELECT,
				description: "is the order paid or not?",
				value: "",
				order: 100,
				required: false,
				visible: true,
				readonly: true,
				options: localPaymentStatus,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "paid_date",
				label: "Payment Date",
				type: FieldTypes.DATE,
				description: "is the order paid or not?",
				value: "",
				order: 100,
				required: false,
				visible: true,
				readonly: true,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "warrantyDate",
				label: "Warranty Expires",
				type: FieldTypes.DATE,
				description: "Warranty expiration date",
				value: "",
				order: 120,
				required: false,
				visible: true,
				readonly: true,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			}
		],
		actions: [
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN, UserRoles.MAINTAINER],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {

					// let new_order: any = {}
					let validated = await mapValue(fields, token, "order");
					let new_order = new Order(validated);
					if(new_order.rating) {
						new_order.rating = parseInt(new_order.rating);
					}
					await MainAPI.update(token, "order", new_order);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN, UserRoles.MAINTAINER],
				lable: "Approve",
				class: "btn btn-outline-success shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && state_field.value == OrderStatus.Requested);
				},
				action: async (token: string, fields: IField[]) => {

					let new_order = await mapValue(fields, token, "order");

					if(!new_order.price || !new_order.warrantyAmount) {
						throw new Error("first you have to set Price and Warranty Amount");
					}

					new_order.warrantyAmount = parseInt(new_order.warrantyAmount);
					new_order.state = OrderStatus.Approved;

					await MainAPI.update(token, "order", new_order);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN, UserRoles.MAINTAINER],
				lable: "Cancel",
				class: "btn btn-danger shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && [OrderStatus.Requested, OrderStatus.Approved, OrderStatus.Received].includes(state_field.value));
				},
				action: async (token: string, fields: IField[]) => {

					let new_order = await mapValue(fields, token, "order");
					new_order.state = OrderStatus.Cancelled;
					await MainAPI.update(token, "order", new_order);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN],
				lable: "Paid",
				class: "btn btn-outline-primary shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "is_paid");
					return (state_field != undefined && state_field.value == "not_paid");
				},
				action: async (token: string, fields: IField[]) => {

					let new_order = await mapValue(fields, token, "order");

					if(!new_order.price) {
						throw new Error("First you have to set Price!");
					}

					new_order.is_paid = "paid";
					await MainAPI.update(token, "order", new_order);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN],
				lable: "Received",
				class: "btn btn-warning shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && state_field.value == OrderStatus.Approved);
				},
				action: async (token: string, fields: IField[]) => {
					let new_order = await mapValue(fields, token, "order");
					new_order.state = OrderStatus.Received;
					await MainAPI.update(token, "order", new_order);
				}
			},
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "On Going",
				class: "btn btn-primary shadow-sm",
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					let technician_field = fields.find(fld => (fld.id == "technician"));
					if(technician_field && (technician_field.value != "" || technician_field.value != null || technician_field.value != 0 || technician_field.value != "0") && ((parseInt(technician_field.value) == loggedUser.Id && loggedUser.Roles.includes(UserRoles.MAINTAINER)) || loggedUser.Roles.includes(UserRoles.ADMIN))) {
						return (state_field != undefined && state_field.value == OrderStatus.Received);
					}

					return false;
				},
				action: async (token: string, fields: IField[]) => {
					let new_order = await mapValue(fields, token, "order");
					if(!new_order.technician){
						throw new Error("Technician must be assigned first");
					}
					new_order.state = OrderStatus.Ongoing;
					await MainAPI.update(token, "order", new_order);
				}
			},
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "Finished",
				class: "btn btn-success shadow-sm",
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					let technician_field = fields.find(fld => (fld.id == "technician"));
					if(technician_field && (parseInt(technician_field.value) == loggedUser.Id || loggedUser.Roles.includes(UserRoles.ADMIN))) {
						return (state_field != undefined && state_field.value == OrderStatus.Ongoing);
					}

					return false;
				},
				action: async (token: string, fields: IField[]) => {
					let new_order = await mapValue(fields, token, "order");
					new_order.state = OrderStatus.Finished;
					await MainAPI.update(token, "order", new_order);
				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					return loggedUser.Roles.includes(UserRoles.ADMIN);
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "order", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],

		relatedList: [
			{
                id: "rl_repair",
                form: "tbl_repair",
                lable: "Repairs",
                relatingColumn: "OrderId",
                loader: (fields: IField[]): any => {
                    let field = fields.find(fld => (fld.id == "id"));
                    return {
                        orderId: {
                            value: field ? field.value : "",
                            operator: Operators.IS,
                            type: field ? field.type : FieldTypes.NUMBER
                        }
                    };
                }
			}
		],

		onsubmit: async (token: string, fields: IField[]): Promise<any> => {

			let new_order = await mapValue(fields, token, "order");

			if(new_order.warrantyAmount) {
				new_order.warrantyDate = new Date(new Date().getTime() + (3600*24*30*1000*new_order.warrantyAmount)).toISOString();
			}
			new_order.date = new Date().toISOString();
			new_order.rating = (new_order.rating && new_order.rating != "") ? parseInt(new_order.rating) : 0;
			return await MainAPI.createNew(token, "order", new_order);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {

			// let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);

			let data = {};
			if (parseInt(id) > 0) {
				data = await MainAPI.getSingle(token, "order", id);
			}

			return mapSingle(all_fields, {

				"id": (dt: any) => ({
					value: parseInt(id) > 0 ? dt.id : ""
				}),
				"deviceId": (dt: any) => ({
					options: localData.Devices,
					value: parseInt(id) > 0 ? dt.deviceId : ""
				}),
				"serviceId": (dt: any) => ({
					options: localData.Services,
					value: parseInt(id) > 0 ? dt.serviceId : ""
				}),
				"userId": (dt: any) => ({
					options: localData.Users,
					value: parseInt(id) > 0 ? dt.userId : ""
				}),
				"is_paid": (dt: any) => ({
					options: localPaymentStatus,
					value: parseInt(id) > 0 ? dt.is_paid : ""
				}),
				"paid_date": (dt: any) => ({
					options: localData.Users,
					value: parseInt(id) > 0 ? Utils.convertISOToDate(dt.paid_date) : ""
				}),
				"technician": (dt: any) => ({
					options: localData.Technician,
					value: parseInt(id) > 0 ? dt.technician : ""
				}),
				"warrantyDate": (dt: any) => ({
					value: parseInt(id) > 0 ? Utils.convertISOToDate(dt.warrantyDate) : ""
				}),
				"warrantyAmount": (dt: any) => ({
					value: parseInt(id) > 0 ? parseInt(dt.warrantyAmount) : ""
				}),
				"rating": (dt: any) => ({
					value: parseInt(id) > 0 ? dt.rating : ""
				}),
				"date": (dt: any) => ({
					value: parseInt(id) > 0 ? Utils.convertISOToDate(dt.date) : ""
				}),
				"number": (dt: any) => ({
					value: parseInt(id) > 0 ? dt.number : ""
				}),
				"imei": (dt: any) => ({
					value: parseInt(id) > 0 ? dt.imei : ""
				}),
				"price": (dt: any) => ({
					value: parseInt(id) > 0 ? dt.price : ""
				}),
				"state": (dt: any) => ({
					value: parseInt(id) > 0 ? dt.state : ""
				}),

			}, data);

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			console.log("on list loader ", condition);
			let data = await MainAPI.getAll(token, "order", pageNumber, pageSize, condition);

			let records = data.Items.map((rec) => ({
				...rec,
				warrantyDate: Utils.convertISOToDate(rec.warrantyDate),
				date: Utils.convertISOToDate(rec.date),
				paid_date: Utils.convertISOToDate(rec.paid_date),
				deviceId: Utils.getFromArray("value", rec.deviceId, "label", localData.Devices),
				serviceId: Utils.getFromArray("value", rec.serviceId, "label", localData.Services),
				userId: Utils.getFromArray("value", rec.userId, "label", localData.Users),
				technician: Utils.getFromArray("value", rec.technician, "label", localData.Users),
				state: Utils.getFromArray("value", rec.state, "label", localOrderStates),
				is_paid: Utils.getFromArray("value", rec.is_paid, "label", localPaymentStatus)
			}));

			data.Items = records;
			return data;

		}
	},
	{
		title: "Repairs",
		id: "tbl_repair",
		roles: [UserRoles.RECEPTION, UserRoles.ADMIN],
		actions: [
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				action: async (token: string, fields: IField[]) => {

					let new_repair = await mapValue(fields, token, "repair");
					await MainAPI.update(token, "repair", new_repair);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN, UserRoles.MAINTAINER],
				lable: "Approve",
				class: "btn btn-outline-success shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && state_field.value == OrderStatus.Requested);
				},
				action: async (token: string, fields: IField[]) => {

					let new_order = await mapValue(fields, token, "reapir");

					new_order.warrantyAmount = parseInt(new_order.warrantyAmount);
					new_order.state = OrderStatus.Approved;

					await MainAPI.update(token, "repair", new_order);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN, UserRoles.MAINTAINER],
				lable: "Cancel",
				class: "btn btn-danger shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && [OrderStatus.Requested, OrderStatus.Approved, OrderStatus.Received].includes(state_field.value));
				},
				action: async (token: string, fields: IField[]) => {

					let new_order = await mapValue(fields, token, "repair");

					new_order.state = OrderStatus.Cancelled;

					await MainAPI.update(token, "repair", new_order);

				}
			},
			{
				roles: [UserRoles.RECEPTION, UserRoles.ADMIN],
				lable: "Received",
				class: "btn btn-warning shadow-sm",
				condition: (token: string, fields: IField[]): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && state_field.value == OrderStatus.Approved);
				},
				action: async (token: string, fields: IField[]) => {
					let new_order = await mapValue(fields, token, "repair");
					new_order.state = OrderStatus.Received;
					await MainAPI.update(token, "repair", new_order);
				}
			},
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "On Going",
				class: "btn btn-primary shadow-sm",
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && state_field.value == OrderStatus.Received);
				},
				action: async (token: string, fields: IField[]) => {
					let new_order = await mapValue(fields, token, "repair");
					new_order.state = OrderStatus.Ongoing;
					await MainAPI.update(token, "repair", new_order);
				}
			},
			{
				roles: [UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "Finished",
				class: "btn btn-success shadow-sm",
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					let state_field = fields.find(fld => fld.id == "state");
					return (state_field != undefined && state_field.value == OrderStatus.Ongoing);
				},
				action: async (token: string, fields: IField[]) => {
					let new_order = await mapValue(fields, token, "repair");
					new_order.state = OrderStatus.Finished;
					await MainAPI.update(token, "repair", new_order);
				}
			},
			{
				roles: [UserRoles.ADMIN],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					return loggedUser.Roles.includes(UserRoles.ADMIN);
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "repair", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [
			{
                id: "rl_comment",
                form: "tbl_feedback",
                lable: "Comments",
                relatingColumn: "repairId",
                loader: (fields: IField[]): any => {
                    let field = fields.find(fld => (fld.id == "id"));
                    return {
                        repairId: {
                            value: field ? field.value : "",
                            operator: Operators.IS,
                            type: field ? field.type : FieldTypes.NUMBER
                        }
                    };
                }
			}
		],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "orderId",
				label: "Order",
				type: FieldTypes.REFERENCE,
				description: "Under Which order the repair is requested",
				references: "tbl_order",
				value: "",
				order: 30,
				required: true,
				visible: true,
				readonly: false,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "closingDate",
				label: "Date Closed",
				type: FieldTypes.DATE,
				description: "Closing Date of the Repair",
				value: "",
				order: 20,
				required: false,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "date",
				label: "Date",
				type: FieldTypes.DATE,
				description: "",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "state",
				label: "Status",
				type: FieldTypes.SELECT,
				description: "Current State of the repair",
				value: "",
				order: 10,
				required: false,
				visible: true,
				readonly: true,
				options: localOrderStates,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "description",
				label: "Description",
				type: FieldTypes.TEXTAREA,
				description: "Problem explanation",
				value: "",
				order: 20,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
		],

		onsubmit: async (token: string, fields: IField[]): Promise<void> => {

			let new_repair = await mapValue(fields, token, "repair");
			return await MainAPI.createNew(token, "repair", new_repair);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {

			// let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);

			if (parseInt(id) <= 0) {
				return mapSingle(all_fields, {
					"date": (dt: any) => ({
						value: ""
					}),
					"orderId": (dt: any) => ({
						options: localData.Orders,
						value: ""
					}),
					"description": (dt: any) => ({
						value: ""
					}),
					"state": (dt: any) => ({
						options: localOrderStates,
						value: ""
					}),
				}, {});
			}


			let data = await MainAPI.getSingle(token, "repair", id);
			if (data) {
				return mapSingle(all_fields, {
					"id": (dt: any) => ({
						value: dt.id
					}),
					"date": (dt: any) => ({
						value: Utils.convertISOToDate(dt.date)
					}),
					"orderId": (dt: any) => ({
						value: dt.orderId,
						options: localData.Orders
					}),
					"description": (dt: any) => ({
						value: dt.description
					}),
					"state": (dt: any) => ({
						options: localOrderStates,
						value: dt.state
					}),
					"closingDate": (dt: any) => ({
						value: dt.closingDate ? Utils.convertISOToDate(dt.closingDate) : ""
					})
				}, data);
			}

			return all_fields;

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			let data = await MainAPI.getAll(token, "repair", pageNumber, pageSize, condition);

			let records = data.Items.map((rec) => ({
				...rec,
				date: Utils.convertISOToDate(rec.date),
				state: Utils.getFromArray("value", rec.state, "label", localOrderStates)
			}));

			data.Items = records;
			return data;

		}
	},
	{
		title: "Comments",
		id: "tbl_feedback",
		roles: [UserRoles.RECEPTION, UserRoles.MAINTAINER, UserRoles.ADMIN],
		actions: [
			{
				roles: [UserRoles.RECEPTION, UserRoles.MAINTAINER, UserRoles.ADMIN],
				lable: "Update",
				class: "btn-light bg-white shadow-sm",
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					let user_id_field = fields.find(fld => fld.id == "userId");
					return (user_id_field != undefined && loggedUser.Id == parseInt(user_id_field.value));
				},
				action: async (token: string, fields: IField[]) => {

					let new_repair = await mapValue(fields, token, "feedback");
					await MainAPI.update(token, "feedback", new_repair);

				}
			},
			{
				roles: [UserRoles.ADMIN, UserRoles.CUSTOMER, UserRoles.MAINTAINER],
				lable: "Delete",
				class: "btn-danger shadow-sm",
				backToList: true,
				condition: (token: string, fields: IField[], loggedUser: any): boolean => {
					let user_id_field = fields.find(fld => fld.id == "userId");
					return (user_id_field != undefined && loggedUser.Id == parseInt(user_id_field.value));
				},
				action: async (token: string, fields: IField[]) => {
					let id_field = fields.find(fld => fld.id == "id");
					if(id_field){
						if(window.confirm("Are you sure you want to delete the record? This action cannot be undone!")) {
							await MainAPI.delete(token, "feedback", parseInt(id_field.value));
						}
					} else {
						throw new Error("Unknown Record Id field is empty!");
					}
				}
			}
		],
		relatedList: [],
		fields: [
			{
				id: "id",
				label: "Identifier",
				type: FieldTypes.NUMBER,
				description: "",
				value: "",
				order: 1,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "repairId",
				label: "Repair",
				type: FieldTypes.REFERENCE,
				description: "For which repair is this comment written",
				references: "tbl_repair",
				value: "",
				order: 30,
				required: true,
				visible: true,
				readonly: false,
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "userId",
				label: "Commented By",
				type: FieldTypes.REFERENCE,
				description: "Who wrote this comment",
				references: "tbl_user",
				value: "",
				order: 40,
				required: true,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "date",
				label: "Date",
				type: FieldTypes.DATE,
				description: "When was this comment is written or posted",
				value: "",
				order: 50,
				required: false,
				visible: true,
				readonly: true,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
			{
				id: "body",
				label: "Comment",
				type: FieldTypes.TEXTAREA,
				description: "Comment content",
				value: "",
				order: 60,
				required: true,
				visible: true,
				readonly: false,
				// options?: { value: string, label: string }[];
				onchange: async (token: string, fields: IField[], value: any, set_field: (vl: IField) => void): Promise<any> => {
					return value;
				}
			},
		],

		onsubmit: async (token: string, fields: IField[]): Promise<any> => {

			let new_repair = await mapValue(fields, token, "feedback");
			return await MainAPI.createNew(token, "feedback", new_repair);

		},

		onload: async (token: string, all_fields: IField[], localData: (LocalData | any), loggedUser: (AuthResult | any), id?: any): Promise<IField[]> => {

			let data = {};
			if (parseInt(id) > 0) {
				data = await MainAPI.getSingle(token, "feedback", id);
			}

			return mapSingle(all_fields, {
				"id": (dt: any) => ({
					value: (parseInt(id) > 0) ? dt.id : ""
				}),
				"date": (dt: any) => ({
					value: Utils.convertISOToDate((parseInt(id) > 0) ? dt.date : new Date().toISOString())
				}),
				"repairId": (dt: any) => ({
					value: (parseInt(id) > 0) ? dt.repairId : "",
					options: localData.Repairs,
					visible: ((id <= 0) || ((parseInt(id) > 0) && dt.userId == loggedUser.Id))
				}),
				"body": (dt: any) => ({
					value: (parseInt(id) > 0) ? dt.body : "",
					visible: ((id <= 0) || ((parseInt(id) > 0) && dt.userId == loggedUser.Id))
				}),
				"userId": (dt: any) => ({
					options: localData.Users,
					value: (parseInt(id) > 0) ? dt.userId : loggedUser.Id,
				})
			}, data);

		},

		listLoader: async (token: string, pageNumber: number, pageSize: number, localData: (LocalData | any), condition?: any): Promise<IPagination<any>> => {

			let data = await MainAPI.getAll(token, "feedback", pageNumber, pageSize, condition);

			let records = data.Items.map((rec) => ({
				...rec,
				date: Utils.convertISOToDate(rec.date),
				repairId: Utils.getFromArray("value", rec.repairId, "label", localData.Repairs),
				userId: Utils.getFromArray("value", rec.userId, "label", localData.Users)
			}));

			data.Items = records;
			return data;

		}
	}
];

export default tables;
