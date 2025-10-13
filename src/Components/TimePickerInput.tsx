import React, { useState } from 'react';

import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePickerInput = ({ label, time, setTime }: { label: string; time: string; setTime: (time: string) => void }) => {
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: any, selectedTime?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedTime) {
            const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setTime(formattedTime);
        }
    };

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <TextInput value={time} placeholder="Select Time" editable={false}
                    style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}
                />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

export default TimePickerInput;