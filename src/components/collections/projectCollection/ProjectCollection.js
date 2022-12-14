import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../../context/AuthContext";
import {useHistory} from "react-router-dom";
import PaintingCard from "../../cards/paintingCard/PaintingCard";
import dummy from '../../../assets/placeholder-image.png'
import '../Collection.css';

function ProjectCollection() {
    const [ projectCollection, setProjectCollection ] = useState([]);
    const [ reflectionCollection, setReflectionCollection ] = useState([]);
    const {user: {username}} = useContext(AuthContext);
    const history = useHistory();
    const token = localStorage.getItem('token');
    const source = axios.CancelToken.source();

    useEffect(() => {
        async function fetchProjectCollection() {
            try {
                const [responseOne, responseTwo] = await Promise.all([
                    axios.get(`http://localhost:8080/projects/user/${username}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            cancelToken: source.token,
                    }),
                    axios.get(`http://localhost:8080/reflections/all`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            cancelToken: source.token,
                    })
                ])
                setProjectCollection(responseOne.data);
                setReflectionCollection(responseTwo.data);
            } catch(error) {
                console.error(error);
            }
        }
        fetchProjectCollection();
        return function cleanup() {
            source.cancel();
        }
    }, []);

    function redirect(projectId) {
        history.push(`/user/project/${projectId}`)
    }

    return (
        <>
            <section className="painting-cards__container">
                {(projectCollection
                    .sort((a, b) => b.id - a.id))
                    .map((project) => {
                        const reflection = (reflectionCollection
                            .sort((a, b) => b.id - a.id))
                            .find((update) => { return update.projectDto.id === project.id });
                        return (
                            reflection ?
                                <PaintingCard key={project.id}
                                              title={project.title}
                                              imgDescription={"foto van schilderproject"}
                                              img={reflection ? reflection.fileUploadResponse.url : dummy }
                                              onClick={() => redirect(project.id)}/>
                                :
                                <PaintingCard key={project.id}
                                              title={project.title}
                                              imgDescription={"foto van schilderproject"}
                                              img={dummy }
                                              onClick={() => redirect(project.id)}/>
                        )
                    })}
            </section>
        </>
    )
}

export default ProjectCollection;
