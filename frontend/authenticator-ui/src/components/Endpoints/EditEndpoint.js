import React from 'react';
import {useNavigate} from 'react-router-dom';
import { getEndpoint } from '../../services/EndpointService';

function EditEndpoint({ endpointId, setIsAddButtonDisabled, setIsEditButtonDisabled, setIsDeleteButtonDisabled }) {

  const navigate = useNavigate();
  const [id, setId] = React.useState('');
  const [name, setName] = React.useState('');
  const [endpoint, setEndpoint] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [method, setMethod] = React.useState('');

  React.useEffect(() => {
    const _getEndpointDetails = async (id) => {
        let data = await getEndpoint(id);
        if (data.returnCode === -2)
            navigate('/signin');
        else if (data.returnCode === -1)
            navigate('/error');
        else{
            let jsonParsedData = JSON.parse(data.data.endpoint);
            setId(jsonParsedData.id);
            setMethod(jsonParsedData.method);
            setName(jsonParsedData.name);
            setEndpoint(jsonParsedData.endpoint);
            setDescription(jsonParsedData.description);
        }
    };

    setIsAddButtonDisabled(true);
    setIsEditButtonDisabled(true);
    setIsDeleteButtonDisabled(false);

    _getEndpointDetails(endpointId);
  }, []);

  return (
    <div>
      <p>{description}</p>
      <p>{name}</p>
      <p>{method}</p>
    </div>
  )
}

export default EditEndpoint
