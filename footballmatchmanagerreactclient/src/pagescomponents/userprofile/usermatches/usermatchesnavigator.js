import { Tab, Nav, Row } from "react-bootstrap";
import "./../../../css/usermatchesnavigator.css"
import UserMatches from "./usermatches";

export default function UserMatchesNavigator() {
    //Не могу использовать navigate
    return (
        <Tab.Container defaultActiveKey="participant">
            <Row className="umnav-main-container">
                <Nav className="umnav-container">
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" eventKey="participant">
                            Участник
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="umnav-item">
                        <Nav.Link className="umnav-item-link" eventKey="creator">
                            Организатор
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Row>
            <Row className="um-content-container">
                <Tab.Content className="h-100 p-0">
                    <Tab.Pane className="h-100" eventKey="participant">
                        <UserMatches />
                    </Tab.Pane>
                    <Tab.Pane className="h-100" eventKey="creator">
                        <UserMatches />
                    </Tab.Pane>
                </Tab.Content>
            </Row>
        </Tab.Container>
    );
} 