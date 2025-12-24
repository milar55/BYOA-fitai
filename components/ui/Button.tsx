import { Text, Pressable, ActivityIndicator, View } from 'react-native';
import React from 'react';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  icon,
}: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-saffron shadow-lg shadow-saffron/30';
      case 'secondary':
        return 'bg-turmericGold';
      case 'outline':
        return 'bg-transparent border-2 border-saffron';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-saffron';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return 'text-saffron';
      default:
        return 'text-white';
    }
  };

  return (
    <Pressable
      onPress={() => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2',location:'components/ui/Button.tsx:onPress',message:'Button onPress fired',data:{title,variant,disabled,loading},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.log(`[DBG_BUTTON] onPress title="${title}" variant="${variant}" disabled=${disabled} loading=${loading}`);
        onPress();
      }}
      onPressIn={() => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'components/ui/Button.tsx:onPressIn',message:'Button press in',data:{title,variant},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.log(`[DBG_BUTTON] onPressIn title="${title}" variant="${variant}"`);
      }}
      onPressOut={() => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'components/ui/Button.tsx:onPressOut',message:'Button press out',data:{title,variant},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.log(`[DBG_BUTTON] onPressOut title="${title}" variant="${variant}"`);
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        { 
          opacity: pressed ? 0.7 : 1.0,
          transform: [{ scale: pressed ? 0.98 : 1.0 }]
        }
      ]}
      className={`
        flex-row items-center justify-center px-6 py-4 rounded-2xl
        ${getVariantStyles()}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#FF9933' : '#FFFFFF'} />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={`
              text-lg font-poppins-semibold text-center
              ${getTextStyles()}
            `}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

