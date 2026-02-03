import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';
import {
    StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';

// getApplicationContext() <<<<
// context: bối cảnh, ngữ cảnh



// tạo context chung cho 3 component bên dưới
const AppContext = createContext();

const AppContextProvider = (props) => {
    const [name, setName] = useState('nguyen van anh');
    const [phepToan, setPhepToan] = useState(null)
    const [so, setSo] = useState(null)

    // phép toán: mũ 2, mũ 3, căn bậc 2, căn bậc 3, giai thừa
    // số
    // component 1: cung cấp giá trị phép toán, số
    // component 2: sử dụng giá trị phép toán, số sau đó hiển thị

    return (
        <AppContext.Provider
            value={{ name, setName, phepToan, setPhepToan, so, setSo }}>
            {props.children}
        </AppContext.Provider>
    )
}

const DisplayAge = (props) => {
    const { phepToan, so } = useContext(AppContext);
    const [result, setResult] = useState(null)

    useEffect(() => {
        let res = null;
        switch (phepToan) {
            case 'mu2':
                res = Math.pow(so, 2);
                break;
            case 'mu3':
                res = Math.pow(so, 3);
                break;
            case 'can2':
                res = Math.sqrt(so);
                break;
            case 'can3':
                res = Math.cbrt(so);
                break;
            case 'giaiThua':
                res = 1;
                for (let i = 1; i <= so; i++) {
                    res *= i;
                }
                break;
            default:
                res = null;
        }
        setResult(res);
    }, [phepToan, so])

    return (
        <View>
            <Text>Result: {result}</Text>
        </View>
    )
}

const DisplayName = (props) => {
    const { setPhepToan, setSo, phepToan, so } = useContext(AppContext);

    const randomOperation = () => {
        const operations = ['mu2', 'mu3', 'can2', 'can3', 'giaiThua'];

        const randOp = operations[Math.floor(Math.random() * operations.length)];
        const randNum = Math.floor(Math.random() * 100);

        setPhepToan(randOp);
        setSo(randNum);
    }

    useEffect(() => {
        randomOperation();
    }, [])

    return (
        <View>
            <Text>Phep toan: {phepToan}</Text>
            <Text>So: {so}</Text>
            <DisplayAge />
            <TouchableOpacity
                onPress={randomOperation}
                style={{
                    backgroundColor: 'blue',
                    padding: 10,
                    marginTop: 10,
                }}
            >
                <Text style={{ color: 'white' }}>Random Operation</Text>
            </TouchableOpacity>
        </View>
    )
}

const Demo = (props) => {
    return (
        <AppContextProvider>
            <View>
                <DisplayName />
            </View>
        </AppContextProvider>
    )
}
export default Demo

const styles = StyleSheet.create({})