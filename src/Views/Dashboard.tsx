import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import { IconButton } from "@mui/material";
import { Menu, PlayArrow } from "@mui/icons-material";
import Chart from 'chart.js/auto';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AlertContext from "../Contexts/AlertContext";
import MainAPI from "../APIs/MainAPI";
import Operators from "../Enums/Operators";
import FieldTypes from "../Enums/FiedTypes";
import OrderStatus from "../Enums/OrderStatus";
import { useNavigate } from "react-router-dom";

function Dashboard() {

	const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
	const {loggedUser, cookies, localData} = useContext(AuthContext);
	const [balance, setBalance] = useState<Map<number, { tickets: any[], pay_in: number, pay_out: number }>>(new Map());
	const [isAdmin, setIsAdmin] = useState<boolean>(true);
	const [orders, setOrders] = useState<any[]>([]);
	const [chartData, setChartData] = useState<any>({});
	const [inputs, setInputs] = useState<any>({
		startDate: "",
		endDate: ""
	});

	const navigate = useNavigate();

	const chart_ref = useRef(null);
	const chart = useRef<any>(null);
	const StateColors: any = {
		[OrderStatus.Approved]: '#1a8307',
		[OrderStatus.Requested]: '#1c5aec',
		[OrderStatus.Finished]: '#0ed145',
		[OrderStatus.Cancelled]: '#ec1c24',
		[OrderStatus.Closed]: '#61f5ad',
		[OrderStatus.Taken]: '#61f5ad',
		[OrderStatus.Ongoing]: 'orange',
		[OrderStatus.Received]: 'orange'
	};

	useEffect(() => {

		if(chart_ref.current){

			chart.current = new Chart(chart_ref.current, {
				type: 'doughnut',
				data: {
					labels: [
						'Approved',
						'Requested',
						'Finished',
						'Cancelled',
						'Completed',
						'On Going'
					],
					datasets: [
						{
							label: 'Order Percentages',
							data: [2, 3, 4, 5, 0, 7],
							backgroundColor: [
								'#1a8307',
								'#1c5aec',
								'#0ed145',
								'#ec1c24',
								'#61f5ad',
								'orange'
							],
							hoverOffset: 4
						}
					]
				},
				options: {
					// onClick: (e) => {
					// const canvasPosition = getRelativePosition(e, chart);
		
					// // Substitute the appropriate scale IDs
					// const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
					// const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
					// }
				}
			});
	
		}else {
			console.log("element not found");
		}

		return () => {chart_ref.current = null}

	}, []);

	useEffect(() => {
		// setIsAdmin(loggedUser.Roles.includes(UserRoles.ADMIN));
		loadData()
	}, []);
	
	useEffect(() => {
		chart.current.data.datasets[0].data = [chartData.approved, chartData.requested, chartData.finished, chartData.cancelled, chartData.completed, chartData.ongoing];
		chart.current.update();

	}, [chartData]);

	const inputOnChange = async (event: any) => {
		setInputs((inp: any) => ({...inp, [event.target.name]: event.target.value}));
	}

	const loadData = async () => {

		let load_orders = await MainAPI.getorAll(cookies.login_token, "order", 1, 1000, ((inputs.startDate != "") ? [
			{
				name: "date",
				operator: Operators.GREATER,
				type: FieldTypes.DATE,
				value: Utils.dateToISO(inputs.startDate)
			},
			{
				name: "date",
				operator: Operators.LESS,
				type: FieldTypes.DATE,
				value: Utils.dateToISO(inputs.endDate)
			}
		] : []));

		setOrders(load_orders.Items);

		let chart_data = {
			cancelled: 0,
			requested: 0,
			approved: 0,
			finished: 0,
			total_money: 0,
			future_money: 0,
			completed: 0,
			ongoing: 0
		};

		load_orders.Items.forEach(ord => {
			if(ord.state == OrderStatus.Cancelled) {
				chart_data.cancelled += 1;
			} else if(ord.state == OrderStatus.Requested) {
				chart_data.requested += 1;
			} else if(ord.state == OrderStatus.Finished) {
				chart_data.finished += 1;
			} else if(ord.state == OrderStatus.Approved) {
				chart_data.approved += 1;
			} else if([OrderStatus.Ongoing, OrderStatus.Received].includes(ord.state)) {
				chart_data.ongoing += 1;
			} else if(ord.state == OrderStatus.Paid || ord.state == OrderStatus.Closed || ord.state == OrderStatus.Taken) {
				chart_data.completed += 1;
			}

			if(ord.is_paid == "paid") {
				chart_data.total_money += (ord.price ? parseInt(ord.price) : 0);
			} else if(ord.state != OrderStatus.Cancelled) {
				chart_data.future_money += (ord.price ? parseInt(ord.price) : 0);
			}

		});

		setChartData(chart_data);
	}

	return (
		<div className="" style={{width: "100vw", height: "100vh"}}>
			<div className="w-100" style={{height: "35%", background: "black", overflow: "hidden", position: "relative", zIndex: "100"}}>
				<img src="/images/dashboard_image.png" 
					alt="computer user"
					style={{width: "100%", position: "absolute", top: 0, left: 0, zIndex: -1}}
				/>
				<div className="w-100 d-flex justify-content-between mb-2 px-3 py-1">
					<IconButton onClick={() => { setMenu(true) }}>
						<Menu sx={{fontSize: 40, color: "white"}} />
					</IconButton>
				</div>
				<h3 className="card-title text-white ms-4 mt-0" style={{fontWeight: "bolder"}}>Hello, {loggedUser.FullName}</h3>
				<div className="d-flex justify-content-center mt-5">
					<div className="rounded-4 p-2 me-4 bg-white shadow">
						<input type="date" name="startDate" value={inputs.startDate} onChange={inputOnChange} className="form-control form-control-lg" placeholder="Start Date" />
					</div>
					<div className="rounded-4 p-2 me-4 bg-white shadow">
						<input type="date" name="endDate" value={inputs.endDate} onChange={inputOnChange} className="form-control form-control-lg" placeholder="End Date" />
					</div>
					<button className="btn btn-lg btn-primary shadow" onClick={() => {loadData()}}>
						<PlayArrow sx={{fontSize: 40, margin: "0 10px 0 0", color: "white"}} />
						Run
					</button>
				</div>
				
			</div>
			<div className="d-flex px-3 pt-3" style={{height: "65%", zIndex: "10"}}>
				<div className="col-3 px-2 h-100 pb-3">
					<div className="card shadow">
						<div className="card-body">
							<canvas ref={chart_ref} className="w-100" />
                            <hr />
                            <h6 className="card-title">Order Summary</h6>
						</div>
					</div>
				</div>
				<div className="col-6 px-2 h-100 pb-3">
					<div className="card shadow h-100" style={{}}>
                        <div className="card-body py-3 h-100" style={{overflow: "auto"}}>
                            <div className="d-flex justify-content-between border-bottom">
                                <h5 className="card-title">Last Orders</h5>
                                <span className="card-title text-primary" onClick={() => {navigate(`/list/tbl_order`);}}>See All</span>
                            </div>
                            {/* <hr /> */}
							{
								orders.length > 0 ? (
									orders.map(ord => (
										<div className="py-3 border-bottom d-flex justify-content-between" onClick={() => {navigate(`/form/tbl_order/${ord.id}`);}}>
											<div style={{width: "50%"}} className="d-flex justify-content-start">
												<AppShortcutIcon sx={{fontSize: "40px", marginRight: "10px"}} />
												<div className="col">
													<h6 className="card-title mb-0">{ord.number}</h6>
													<span className="card-subtitle" style={{color: StateColors[ord.state]}}>{ord.state}</span>
												</div>
											</div>
											<div className="col">
												<span className="card-title">{ord.service.title}</span>
											</div>
											<div className="col">
												<span className="card-title"><strong>{ord.price ? `${ord.price}ETB` : "no price"}</strong></span>
											</div>
										</div>
									))
								) : (<h4 className="text-center">No order found</h4>)
							}
                        </div>
                    </div>
				</div>
				<div className="col-3 px-2 h-100">
					<div className="card shadow">
                        <div className="card-body">
                            <div className="py-3 border-bottom d-flex justify-content-start">
                                <ShoppingCartIcon sx={{fontSize: "70px", marginRight: "10px"}} />
                                <div className="col">
                                    <span className="card-subtitle">Total Order</span>
                                    <h2 className="card-title mb-0">{orders.length}</h2>
                                </div>
                            </div>
                            <div className="py-3 border-bottom d-flex justify-content-start">
                                <RemoveShoppingCartIcon sx={{fontSize: "70px", marginRight: "10px"}} />
                                <div className="col">
                                    <span className="card-subtitle">Cancelled Orders</span>
                                    <h2 className="card-title mb-0">{chartData.cancelled}</h2>
                                </div>
                            </div>
                            <div className="py-3 border-bottom d-flex justify-content-start">
                                <AttachMoneyIcon sx={{fontSize: "70px", marginRight: "10px"}} />
                                <div className="col">
                                    <span className="card-subtitle">Total Money</span>
                                    <h2 className="card-title mb-0">{chartData.total_money} ETB</h2>
                                </div>
                            </div>
                            <div className="py-3 border-bottom d-flex justify-content-start">
                                <AttachMoneyIcon sx={{fontSize: "70px", marginRight: "10px"}} />
                                <div className="col">
                                    <span className="card-subtitle">Future Money</span>
                                    <h2 className="card-title mb-0">{chartData.future_money} ETB</h2>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;