import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { menu, close } from "../assets";

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	return (
		<nav
			className={`${styles.paddingX} w-full flex py-5 items-center fixed top-0 z-20 bg-nav`}
		>
			<div
				className="w-full flex justify-between items-center max-w-7xl mx-auto">
				<Link
					to="/"
					className="flex items-center gap-2"
					onClick={() => {
						setActive("");
						window.scrollTo(0, 0);
					}}
				>

					<p className="text-white text-[15.5px] font-bold cursor-pointer flex">
						<span className="sm:block hidden">FalicyFallenicy</span>
					</p>
				</Link>
				<ul className="list-none hidden sm:flex flex-row gap-10">
					{navLinks.map((link) => (
						<li
							key={link.id}
							className={`${
								active === link.title
								? "text-white"
								: "text-secondary"
								}
							  hover:text-white cursor-pointer text-[18px]
								font-medium`}
							onClick={() => setActive(link.title)}>
							<a href={`#${link.id}`}>{link.title}</a>
						</li>
					))}
				</ul>
				<div className="sm:hidden flex flex-1 justify-end items-center">
					<img
						src={toggle ? close : menu}
						alt="menu"
						className="w-[28px] h-[28px] object-contain cursor-pointer"
						onClick={() => setToggle(!toggle)}
					/>
					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-6 bg-purple justify-center absolute top-20 right-0 min-w-[140px] z-10`} style={{
						width: '100%',marginTop: '-1rem'}}>
						<ul className="list-none flex justify-end items-start flex-col gap-4">
							{navLinks.map((link) => (
								<li
									key={link.id}
									className={`${active === link.title ? "text-white" : "text-secondary"
										} hover:text-white cursor-pointer text-[18px]
								font-medium`}
									onClick={() => {
										setToggle(!toggle)
										setActive(link.title)
									}}>
									<a href={`#${link.id}`}>{link.title}</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;