const Embed = ({w, h, id, start, title, className}) => {
	return(
		<iframe width={w} height={h} src={`https://www.youtube.com/embed/${id}?start=${start}`}
				title={title}
				className={className}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen>
		</iframe>
	)
};

export default Embed;