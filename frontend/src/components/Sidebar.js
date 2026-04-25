import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, Typography, Divider } from "@mui/material";
import Image from "mui-image";
import { ExpandMore, Star } from "@mui/icons-material";

import Accordion from "./Accordion.js";

import { jwt } from "../utils/index.js";
import { useBookmarks } from "../contexts/BookmarkContext.js";

const useStyles = makeStyles((theme) => ({
	sidebar: {
		height: "100%",
		position: "absolute",
		backgroundColor: theme.palette.secondary.main,
		color: "white",
		overflow: "auto",
	},
}));

const dashboardMeta = {
	dashboard: { label: "Overview", path: "/dashboard" },
	dashboard1: { label: "Analytics", path: "/dashboard1" },
	dashboard2: { label: "Insights", path: "/dashboard2" },
};

const ButtonWithText = ({ text, icon, more, handler }) => (
	<span key={text}>
		{!more
		&& (
			<Button key={text} sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "8px 40px 8px 16px" }} onClick={(event) => handler(event)}>
				{icon && (<Image src={icon} alt={text} fit="contain" width="25px" />)}
				<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
					{text}
					{more && <ExpandMore />}
				</Typography>
			</Button>
		)}
		{more
		&& (
			<Accordion
				key={text}
				title={(
					<Grid item sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
						<Image src={icon} alt={text} fit="contain" width="25px" />
						<Typography align="center" color="white.main" fontSize="medium" ml={1} display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
							{text}
						</Typography>
					</Grid>
				)}
				content={(
					<Grid container flexDirection="column" width="100%">
						{more.map((el) => (
							<Button key={el.title} color="white" onClick={el.handler}>
								<Typography sx={{ textTransform: "capitalize" }}>{el.title}</Typography>
							</Button>
						))}
					</Grid>
				)}
				alwaysExpanded={false}
				titleBackground="transparent"
				expandIconColor="white"
			/>
		)}
	</span>
);

const ButtonSimple = ({ text, icon, handler, ind }) => (
	<Button key={text} sx={{ minWidth: "30px!important", padding: "0px", marginTop: (ind === 0) ? "0px" : "10px" }} onClick={(event) => handler(event)}>
		<Image src={icon} alt={text} fit="contain" width="30px" />
	</Button>
);

const Sidebar = ({ isSmall: sidebarIsSmall }) => {
	const [isSmall, setIsSmall] = useState(false);
	const navigate = useNavigate();
	const classes = useStyles();
	const { bookmarks } = useBookmarks();

	const isAdmin = jwt.isAdmin();

	useEffect(() => setIsSmall(sidebarIsSmall), [sidebarIsSmall]);

	const buttons = [
		...(isAdmin ? [{
			text: "Users",
			handler: () => {
				navigate("/users");
			},
		}] : []),
		{
			text: "Overview",
			handler: () => {
				navigate("/dashboard");
			},
		},
		{
			text: "Analytics",
			handler: () => {
				navigate("/dashboard1");
			},
		},
		{
			text: "Insights",
			handler: () => {
				navigate("/dashboard2");
			},
		},
	];

	return (
		<div className={classes.sidebar} style={{ width: (isSmall) ? "50px" : "200px", padding: (isSmall) ? "20px 5px" : "20px 5px", textAlign: "center" }}>
			{!isSmall && bookmarks.length > 0 && (
				<div data-testid="sidebar-favorites-section" style={{ marginBottom: "10px" }}>
					<Typography variant="subtitle2" color="white.main" sx={{ opacity: 0.7, textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", mb: 1 }}>
						★ Favorites
					</Typography>
					{bookmarks.map((id) => {
						const meta = dashboardMeta[id];
						if (!meta) return null;
						return (
							<Button
								key={id}
								data-testid={`sidebar-favorite-${id}`}
								sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", padding: "4px 40px 4px 16px" }}
								onClick={() => navigate(meta.path)}
							>
								<Star sx={{ fontSize: "16px", color: "warning.main", mr: 0.5 }} />
								<Typography align="center" color="white.main" fontSize="small" display="flex" alignItems="center" sx={{ textTransform: "capitalize" }}>
									{meta.label}
								</Typography>
							</Button>
						);
					})}
					<Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />
				</div>
			)}
			{!isSmall && buttons.map((button) => (
				<ButtonWithText
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
				/>
			))}
			{isSmall && buttons.map((button, ind) => (
				<ButtonSimple
					key={button.text}
					icon={button.icon}
					text={button.text}
					handler={button.handler}
					more={button.more}
					ind={ind}
				/>
			))}
		</div>
	);
};

export default Sidebar;
