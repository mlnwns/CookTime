import {View, Text, BackHandler} from 'react-native';
import styled from 'styled-components/native';
import {Pressable} from 'react-native';
import CountdownFolder from './CountdownFolder';
import useUiStore from '../../store/uiStore';
import DeleteModeAnimateView from './DeleteModeAnimateView';
import {useNavigation} from '@react-navigation/native';
import CountdownTimer from './CountdownTimer';
import DeleteButton from '../common/DeleteButton';
import FolderContextMenu from './FolderContextMenu';
import TimerContextMenu from './TimerContextMenu';
import {scale} from 'react-native-size-matters';

const TimerView = ({item, isFolder, onTimerClick, onFolderClick}) => {
  const {isDeleteMode, setDeleteMode} = useUiStore(state => state);
  const navigation = useNavigation();

  const handlePress = () => {
    if (isDeleteMode) {
      setDeleteMode(false);
    } else {
      if (isFolder) {
        setTimeout(() => {
          onFolderClick(item);
        }, 1000);

        navigation.navigate('Folder Page', {folder: item});
      } else {
        setTimeout(() => {
          onTimerClick(item);
        }, 1000);

        navigation.navigate('Detail', {timer: item});
      }
    }
  };

  return (
    <TimerViewContainer>
      {/* 삭제 버튼 */}
      <DeleteButtonWrapper isFolder={isFolder}>
        {isDeleteMode && <DeleteButton id={item.id} />}
      </DeleteButtonWrapper>

      {/* 타이머 뷰 */}
      <Pressable
        onPress={handlePress}
        onLongPress={() => {}}
        delayLongPress={200}
        style={{overflow: 'visible', zIndex: 999}}>
        {isFolder ? (
          <FolderContextMenu folder={item}>
            <DeleteModeAnimateView>
              <CountdownFolder folder={item} onFolderClick={onFolderClick} />
            </DeleteModeAnimateView>
          </FolderContextMenu>
        ) : (
          <TimerContextMenu timer={item}>
            <DeleteModeAnimateView>
              <CountdownTimer timer={item} />
            </DeleteModeAnimateView>
          </TimerContextMenu>
        )}
      </Pressable>
    </TimerViewContainer>
  );
};

export default TimerView;

const TimerViewContainer = styled.View`
  z-index: 999;
  position: relative;
  overflow: visible;
`;

const DeleteButtonWrapper = styled.View`
  ${props => props.isFolder && `top: ${scale(15)}px;`}
  z-index: 1000;
`;
