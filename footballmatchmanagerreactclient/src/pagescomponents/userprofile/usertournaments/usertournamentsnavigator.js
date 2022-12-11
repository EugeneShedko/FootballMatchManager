import { Tab, Nav, Row } from "react-bootstrap";
import "./../../../css/usertournamentsnavigator.css"
import UserTournaments from "./usertournaments";

export default function UserTournamentsNavigator() {
    //Не могу использовать navigate
    return (
        <Tab.Container defaultActiveKey="participant">
            <Row className="utnav-main-container">
                <Nav className="utnav-container">
                    <Nav.Item className="utnav-item">
                        <Nav.Link className="utnav-item-link" eventKey="participant">
                            Участник
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="utnav-item">
                        <Nav.Link className="utnav-item-link" eventKey="creator">
                            Организатор
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            <Row className="ut-content-container">
                <Tab.Content className="h-100 p-0">
                    <Tab.Pane className="h-100" eventKey="participant">
                        <UserTournaments />
                    </Tab.Pane>
                    <Tab.Pane className="h-100" eventKey="creator">
                        <UserTournaments />
                    </Tab.Pane>
                </Tab.Content>
            </Row>
        </Tab.Container>
    );
} 