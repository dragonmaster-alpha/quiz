import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/FontAwesome';


const Home = () => {

    const [filldata, setData] = useState<any>();
    const [queno, setqueno] = useState<any>(0);
    const [initque, setinitque] = useState<any>();
    const [answer, setAnswers] = useState<any>();
    const [correct, setCorrect] = useState<any>(false);
    const [checked, setCheck] = useState(false)

    useEffect(() => {
        getBlanksData()
    }, [])

    const getBlanksData = () => {
        firestore().collection('questions').get().then((data: any) => {
            setData(data.docs);
            setinitque(data.docs[queno]._data);

        })
    }

    const checkAnswer = () => {
        setCheck(true)
        if (Object.values(initque?.answer)[0] == answer) {
            setCorrect(true);
        }
        else {
            setCorrect(false);
        }
    }

    const changeQue = () =>{
        setinitque(filldata[queno + 1]._data);
        setAnswers('')
        setCorrect(false)
        setCheck(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.subView}>
                <Text style={styles.text1}>
                    Fill in the missing word
                </Text>

                <View style={{ ...styles.sentsView, marginVertical: hp(4) }}>
                    {initque?.sents.split(" ").map((i: string, index: any) => {
                        return (
                            <Text
                                key={index}
                                style={[styles.text2, i == Object.keys(initque?.answer)[0] ? styles.activetxt : null]}>
                                {i == Object.keys(initque?.answer)[0] ? i+"\t" : i + ' '}
                            </Text>
                        )
                    })}
                </View>
                <View style={{ ...styles.sentsView }}>
                    {initque?.german.split(" ").map((i: string, index: any) => {
                        if (answer && initque?.options.includes(i)) {
                            return (
                                <View
                                    style={{...styles.optionBtn , marginLeft : 0 , marginHorizontal : 5}}>
                                    <Text style={styles.optionTxt}> {answer } </Text>
                                </View>
                            )
                        }
                        else {
                            return (
                                <Text
                                    key={index}
                                    style={[styles.text2, i == Object.values(initque?.answer)[0] ? styles.activetxt : null]}>
                                    {i == Object.values(initque?.answer)[0] ? "      "+"\t\t" : i+" "}
                                </Text>
                            )
                        }

                    })}
                </View>
                <View style={styles.optionView}>
                    {initque?.options.map((o: string, idx: any) => {
                        return (
                            <TouchableOpacity
                                key={idx}
                                disabled={answer ? true : false}
                                onPress={() => setAnswers(o)}
                                style={[styles.optionBtn, answer == o && { backgroundColor: "#6392A6", width: wp(25) }]}>
                                {answer != o && <Text style={styles.optionTxt}> {o} </Text>}
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={[styles.bottomView, checked ? correct ? styles.successBottom : styles.failMsg : null]}>
                    {checked && <View style={{ ...styles.msgView }}>
                        <Text style={styles.successMsg}>
                            {correct ? 'Greate Job!' : 'Answer : ' + Object.values(initque?.answer)[0]}
                        </Text>
                        <Icon name={"flag"} size={15} color={'white'} />
                    </View>}
                    <TouchableOpacity
                        onPress={() => { !checked ? checkAnswer() : changeQue() }}
                        style={[styles.continueBtn, !checked && answer ? { backgroundColor: "#01DFEA" } : checked && { backgroundColor: "white" }]}>
                        <Text style={[{ ...styles.text1, fontWeight: 'bold' }, checked ? correct ? { color: '#01DFEA' } : { color: '#FF7B88' } : null]} >
                            {answer && !checked ? 'CHECK ANSWER' : 'CONTINUE'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}

export default Home;

const styles = StyleSheet.create({
    container: {
        height: hp(100),
        backgroundColor: '#76DAFE'
    },
    subView: {
        height: hp(85),
        marginTop: hp(15),
        paddingTop: hp(10),
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: "#3C6C82"
    },
    text1: {
        fontSize: wp(4),
        color: 'white'
    },
    text2: {
        fontSize: wp(5),
        color: 'white',
        textAlign: 'center',
        opacity: 0.8
    },
    activetxt: {
        textDecorationLine: "underline",
        fontWeight: "bold",
        opacity: 1
    },
    sentsView: {
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    optionView: {
        width: "80%",
        marginVertical: hp(3),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    optionBtn: {
        paddingVertical: hp(2),
        marginTop: 15,
        marginLeft: 15,
        paddingHorizontal: wp(8),
        borderRadius: 15,
        backgroundColor: 'white',
        elevation: 10,

    },
    optionTxt: {
        fontSize: wp(4),
        color: "#3C6C82",
        fontWeight: 'bold'
    },
    bottomView: {
        // borderWidth: 1,
        bottom: hp(0),
        width: "100%",
        height: "35%",
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    successBottom: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#01DFEA'
    },
    failMsg: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: '#FF7B88'
    },
    msgView: {
        top: hp(3),
        width: "100%",
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'space-between',
        paddingHorizontal: wp(12),
        alignSelf: 'flex-start',
    },
    successMsg: {
        color: 'white',
        fontSize: wp(4),
        fontWeight: 'bold'
    },
    continueBtn: {
        height: hp(8),
        backgroundColor: "#6392A6",
        width: "80%",
        borderRadius: 30,
        elevation: 5,
        alignItems: "center",
        justifyContent: 'center',
    }
})