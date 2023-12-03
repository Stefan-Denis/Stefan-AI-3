import { Link } from "react-router-dom"

export default function Card(props: { title: string, text: string, link: string, button?: string }) {
    return (
        <div className="card" style={{ width: "270px", height: "300px", margin: "10px" }}>
            <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text">{props.text}</p>
                </div>
                <Link to={`/${props.link}`} style={{ marginBottom: '-18px', marginLeft: '-5px' }}>
                    <p className="btn btn-primary">
                        {!props.button ? props.link : props.button}
                    </p>
                </Link>
            </div>
        </div >
    )
}