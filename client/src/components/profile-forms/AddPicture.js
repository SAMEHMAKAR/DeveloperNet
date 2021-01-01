import React from 'react'
import Axios from 'axios';
import { useState } from 'react';
import { updateImage } from '../../actions/profile';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
const AddPicture = ({ updateImage }) => {

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');
    const [image, setImage] = useState('');

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await Axios.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            setImage(data);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };


    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault();
                updateImage(image);
                // console.log(image)
            }}>
                <label htmlFor="imageFile">Image File</label>
                <input
                    type="file"
                    id="imageFile"
                    label="Choose Image"
                    onChange={uploadFileHandler}
                ></input>
                <div>
                    <label></label>
                    <button className="primary" type="submit">
                        Update
              </button>
                </div>
            </form>
        </div>
    )
}


AddPicture.propTypes = {
    updateImage: PropTypes.func.isRequired
};
export default connect(null,
    { updateImage })(withRouter(AddPicture));
