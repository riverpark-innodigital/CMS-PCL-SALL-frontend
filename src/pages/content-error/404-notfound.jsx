import { Button, Result } from 'antd';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {

    const lastPage = Cookies.get('lastPath');
    const navigate = useNavigate();

    const handleBackPage = async () => {
        navigate(-1);
    }

    return(
        <div className='h-screen flex justify-center items-center'>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button onClick={handleBackPage} type="primary">Back Home</Button>}
            />
        </div>
    );
};

export default PageNotFound;